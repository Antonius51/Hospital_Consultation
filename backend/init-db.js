const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// Create connection without database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Anto@3003",
  multipleStatements: true, // Enable multiple statements
});

// Read SQL file
const sqlFile = path.join(__dirname, "database.sql");
const sql = fs.readFileSync(sqlFile, "utf8");

// Execute SQL commands
connection.query(sql, (err, results) => {
  if (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
  console.log("Database initialized successfully!");
  connection.end();
});
