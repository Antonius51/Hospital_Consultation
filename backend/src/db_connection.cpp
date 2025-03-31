#include "../include/db_connection.h"
#include <iostream>

DatabaseConnection* DatabaseConnection::instance = nullptr;

DatabaseConnection::DatabaseConnection() {
    try {
        driver = get_driver_instance();
        con = std::unique_ptr<sql::Connection>(
            driver->connect("tcp://127.0.0.1:3306", "root", "your_password")
        );
        con->setSchema("hospital_db");
    } catch (sql::SQLException &e) {
        std::cerr << "SQL Exception: " << e.what() << std::endl;
        std::cerr << "Error code: " << e.getErrorCode() << std::endl;
        throw;
    }
}

DatabaseConnection* DatabaseConnection::getInstance() {
    if (instance == nullptr) {
        instance = new DatabaseConnection();
    }
    return instance;
}

sql::Connection* DatabaseConnection::getConnection() {
    return con.get();
}

DatabaseConnection::~DatabaseConnection() {
    if (con) {
        con->close();
    }
} 