#ifndef DB_CONNECTION_H
#define DB_CONNECTION_H

#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <cppconn/prepared_statement.h>
#include <memory>
#include <string>

class DatabaseConnection {
private:
    static DatabaseConnection* instance;
    sql::Driver* driver;
    std::unique_ptr<sql::Connection> con;
    
    DatabaseConnection();

public:
    static DatabaseConnection* getInstance();
    sql::Connection* getConnection();
    ~DatabaseConnection();

    // Prevent copying
    DatabaseConnection(const DatabaseConnection&) = delete;
    DatabaseConnection& operator=(const DatabaseConnection&) = delete;
};

#endif // DB_CONNECTION_H 