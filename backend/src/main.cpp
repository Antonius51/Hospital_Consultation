#include <crow.h>
#include <crow/middlewares/cors.h>
#include "../include/db_connection.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main() {
    // Create app with CORS middleware
    crow::App<crow::CORSHandler> app;

    // Configure CORS
    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors
        .global()
        .headers("*")
        .methods("GET"_method, "POST"_method, "PUT"_method, "DELETE"_method);

    // Get database connection
    auto db = DatabaseConnection::getInstance();

    // Patient endpoints
    CROW_ROUTE(app, "/api/patients")
        .methods("GET"_method)
        ([&db](const crow::request& req) {
            try {
                auto conn = db->getConnection();
                auto stmt = std::unique_ptr<sql::Statement>(conn->createStatement());
                auto res = std::unique_ptr<sql::ResultSet>(
                    stmt->executeQuery("SELECT * FROM Patient")
                );

                json patients = json::array();
                while (res->next()) {
                    json patient = {
                        {"patientID", res->getInt("patientID")},
                        {"name", res->getString("first_name")},
                        {"age", res->getInt("Age")},
                        {"gender", res->getString("Gender")},
                        {"contactNo", res->getString("ContactNo")},
                        {"email", res->getString("Email")},
                        {"medicalHistory", res->getString("Medical_history")},
                        {"insuranceDetails", res->getString("Insurance_details")},
                        {"emergencyContact", res->getString("EmergencyContact")}
                    };
                    patients.push_back(patient);
                }

                return crow::response{patients.dump()};
            } catch (const sql::SQLException& e) {
                return crow::response(500, std::string("Database error: ") + e.what());
            }
        });

    // Doctor endpoints
    CROW_ROUTE(app, "/api/doctors")
        .methods("GET"_method)
        ([&db](const crow::request& req) {
            try {
                auto conn = db->getConnection();
                auto stmt = std::unique_ptr<sql::Statement>(conn->createStatement());
                auto res = std::unique_ptr<sql::ResultSet>(
                    stmt->executeQuery("SELECT * FROM Doctor")
                );

                json doctors = json::array();
                while (res->next()) {
                    json doctor = {
                        {"doctorID", res->getInt("DoctorID")},
                        {"name", res->getString("first_name")},
                        {"specialisation", res->getString("Specialization")},
                        {"phoneNo", res->getString("PhoneNo")},
                        {"email", res->getString("Email")}
                    };
                    doctors.push_back(doctor);
                }

                return crow::response{doctors.dump()};
            } catch (const sql::SQLException& e) {
                return crow::response(500, std::string("Database error: ") + e.what());
            }
        });

    // Appointment endpoints
    CROW_ROUTE(app, "/api/appointments")
        .methods("GET"_method)
        ([&db](const crow::request& req) {
            try {
                auto conn = db->getConnection();
                auto stmt = std::unique_ptr<sql::Statement>(conn->createStatement());
                auto res = std::unique_ptr<sql::ResultSet>(
                    stmt->executeQuery(
                        "SELECT a.*, p.first_name as patient_name, d.first_name as doctor_name "
                        "FROM Appointment a "
                        "JOIN Patient p ON a.patientID = p.patientID "
                        "JOIN Doctor d ON a.doctorID = d.doctorID"
                    )
                );

                json appointments = json::array();
                while (res->next()) {
                    json appointment = {
                        {"appID", res->getInt("appID")},
                        {"patientName", res->getString("patient_name")},
                        {"doctorName", res->getString("doctor_name")},
                        {"appDate", res->getString("appDate")},
                        {"appTime", res->getString("appTime")},
                        {"status", res->getString("status")}
                    };
                    appointments.push_back(appointment);
                }

                return crow::response{appointments.dump()};
            } catch (const sql::SQLException& e) {
                return crow::response(500, std::string("Database error: ") + e.what());
            }
        });

    // Start the server
    app.port(8080).multithreaded().run();
    return 0;
} 