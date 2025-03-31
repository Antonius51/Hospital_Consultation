const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5001;

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:8000",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Set default content type for all responses
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Create MySQL connection pool instead of single connection
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "Anto@3003",
    database: "hospitalsystem",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise(); // Convert to promise-based pool

// Test database connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err);
  });

// Global error handler
const handleDatabaseError = (err, res) => {
  console.error("Database error:", err);
  res.setHeader("Content-Type", "application/json");
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ error: "Duplicate entry found" });
  }
  if (err.code === "ER_NO_SUCH_TABLE") {
    return res.status(500).json({
      error:
        "Database table not found. Please check if the database is properly initialized.",
    });
  }
  return res
    .status(500)
    .json({ error: "Database error occurred", details: err.message });
};

// API Routes
app.get("/api/patients", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM Patient");
    res.json(results);
  } catch (error) {
    console.error("Error fetching patients:", error);
    handleDatabaseError(error, res);
  }
});

app.get("/api/doctors", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM Doctor");
    res.json(results);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    handleDatabaseError(error, res);
  }
});

app.get("/api/appointments", async (req, res) => {
  try {
    const query = `
      SELECT a.*, p.first_name as patient_name, d.first_name as doctor_name 
      FROM Appointment a 
      JOIN Patient p ON a.patientID = p.patientID 
      JOIN Doctor d ON a.doctorID = d.doctorID
    `;
    const [results] = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Error fetching appointments" });
  }
});

// Consultations API Endpoints
app.get("/api/consultations", async (req, res) => {
  try {
    const query = `
      SELECT a.*, 
        p.first_name as patient_name, p.last_name as patient_last_name,
        d.first_name as doctor_name, d.last_name as doctor_last_name, 
        d.specialization as doctor_specialization
      FROM Appointment a
      JOIN Patient p ON a.patientID = p.patientID
      JOIN Doctor d ON a.doctorID = d.doctorID
      ORDER BY a.appDate DESC, a.appTime DESC
    `;

    const [consultations] = await pool.query(query);
    res.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/consultations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT a.*, 
        p.first_name as patient_name, p.last_name as patient_last_name,
        d.first_name as doctor_name, d.last_name as doctor_last_name, 
        d.specialization as doctor_specialization
      FROM Appointment a
      JOIN Patient p ON a.patientID = p.patientID
      JOIN Doctor d ON a.doctorID = d.doctorID
      WHERE a.appID = ?
    `;

    const [consultations] = await pool.query(query, [id]);

    if (consultations.length === 0) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    res.json(consultations[0]);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/consultations", async (req, res) => {
  try {
    const {
      patientID,
      doctorID,
      appDate,
      appTime,
      status,
      notes,
      consultationType,
      reason,
    } = req.body;

    // Validate required fields
    if (
      !patientID ||
      !doctorID ||
      !appDate ||
      !appTime ||
      !consultationType ||
      !reason
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the time slot is available
    const [existingAppointments] = await pool.query(
      "SELECT * FROM Appointment WHERE doctorID = ? AND appDate = ? AND appTime = ? AND status != 'Cancelled'",
      [doctorID, appDate, appTime]
    );

    if (existingAppointments.length > 0) {
      return res
        .status(400)
        .json({ error: "This time slot is already booked" });
    }

    // Create appointment
    const [result] = await pool.query(
      "INSERT INTO Appointment (patientID, doctorID, appDate, appTime, status, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [
        patientID,
        doctorID,
        appDate,
        appTime,
        status || "Scheduled",
        notes || `Consultation Type: ${consultationType}\nReason: ${reason}`,
      ]
    );

    const appointmentID = result.insertId;

    // Return created appointment
    const [newAppointment] = await pool.query(
      "SELECT * FROM Appointment WHERE appID = ?",
      [appointmentID]
    );

    res.status(201).json(newAppointment[0]);
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/consultations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { appDate, appTime, status, notes, consultationType, reason } =
      req.body;

    // Get current appointment
    const [appointments] = await pool.query(
      "SELECT * FROM Appointment WHERE appID = ?",
      [id]
    );
    if (appointments.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Update appointment
    await pool.query(
      "UPDATE Appointment SET appDate = ?, appTime = ?, status = ?, notes = ? WHERE appID = ?",
      [
        appDate,
        appTime,
        status || "Scheduled",
        notes || `Consultation Type: ${consultationType}\nReason: ${reason}`,
        id,
      ]
    );

    // Return updated appointment
    const [updatedAppointment] = await pool.query(
      "SELECT * FROM Appointment WHERE appID = ?",
      [id]
    );
    res.json(updatedAppointment[0]);
  } catch (error) {
    console.error("Error updating consultation:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/consultations/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if appointment exists
    const [appointments] = await pool.query(
      "SELECT * FROM Appointment WHERE appID = ?",
      [id]
    );
    if (appointments.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Update appointment status to cancelled
    await pool.query(
      "UPDATE Appointment SET status = 'Cancelled' WHERE appID = ?",
      [id]
    );

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add patient endpoint with better error handling
app.post("/api/patients", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);

    const {
      first_name,
      last_name,
      age,
      gender,
      contact_no,
      email,
      emergency_contact,
      medical_history,
      insurance_details,
    } = req.body;

    // Log received data
    console.log("Received patient data:", {
      first_name,
      last_name,
      age,
      gender,
      contact_no,
      email,
      emergency_contact,
      medical_history,
      insurance_details,
    });

    // Check for undefined or null values
    const requiredFields = {
      first_name,
      last_name,
      age,
      gender,
      contact_no,
      email,
      emergency_contact,
      medical_history,
      insurance_details,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value && value !== 0)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    // Validate age
    if (typeof age !== "number" || isNaN(age) || age < 0 || age > 150) {
      return res.status(400).json({
        error: "Age must be a valid number between 0 and 150",
        receivedAge: age,
        receivedType: typeof age,
      });
    }

    // Validate gender
    const validGenders = ["Male", "Female", "Other"];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        error: "Invalid Gender value. Must be one of: Male, Female, Other",
        receivedGender: gender,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        receivedEmail: email,
      });
    }

    // Validate phone numbers (allow digits, spaces, and common separators)
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    const cleanContactNo = contact_no.replace(/\s/g, "");
    const cleanEmergencyContact = emergency_contact.replace(/\s/g, "");

    if (!phoneRegex.test(cleanContactNo)) {
      return res.status(400).json({
        error: "Contact Number must be at least 10 digits",
        receivedContactNo: contact_no,
      });
    }
    if (!phoneRegex.test(cleanEmergencyContact)) {
      return res.status(400).json({
        error: "Emergency Contact must be at least 10 digits",
        receivedEmergencyContact: emergency_contact,
      });
    }

    const query = `
      INSERT INTO Patient (
        first_name, last_name, age, gender, contact_no, 
        email, emergency_contact, medical_history, insurance_details
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    console.log("Executing query:", query);
    console.log("With values:", [
      first_name,
      last_name,
      age,
      gender,
      contact_no,
      email,
      emergency_contact,
      medical_history,
      insurance_details,
    ]);

    const [result] = await pool.query(query, [
      first_name,
      last_name,
      age,
      gender,
      contact_no,
      email,
      emergency_contact,
      medical_history,
      insurance_details,
    ]);

    const patientID = result.insertId;

    // Return created patient
    const [newPatient] = await pool.query(
      "SELECT * FROM Patient WHERE patientID = ?",
      [patientID]
    );

    res.status(201).json({
      message: "Patient added successfully",
      patientID: patientID,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "An unexpected error occurred",
      details: error.message,
    });
  }
});

// Update patient endpoint
app.put("/api/patients/:id", async (req, res) => {
  try {
    console.log("Received update request body:", req.body);
    const patientId = req.params.id;
    const {
      first_name,
      last_name,
      age,
      gender,
      contact_no,
      email,
      emergency_contact,
      medical_history,
      insurance_details,
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !contact_no || !age || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate age
    if (typeof age !== "number" || isNaN(age) || age < 0 || age > 150) {
      return res.status(400).json({
        error: "Age must be a valid number between 0 and 150",
        receivedAge: age,
        receivedType: typeof age,
      });
    }

    // Validate gender
    const validGenders = ["Male", "Female", "Other"];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        error: "Invalid Gender value. Must be one of: Male, Female, Other",
        receivedGender: gender,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        receivedEmail: email,
      });
    }

    // Validate phone numbers
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    const cleanContactNo = contact_no.replace(/\s/g, "");
    const cleanEmergencyContact = emergency_contact.replace(/\s/g, "");

    if (!phoneRegex.test(cleanContactNo)) {
      return res.status(400).json({
        error: "Contact Number must be at least 10 digits",
        receivedContactNo: contact_no,
      });
    }
    if (!phoneRegex.test(cleanEmergencyContact)) {
      return res.status(400).json({
        error: "Emergency Contact must be at least 10 digits",
        receivedEmergencyContact: emergency_contact,
      });
    }

    // Update patient
    await pool.query(
      "UPDATE Patient SET first_name = ?, last_name = ?, email = ?, contact_no = ?, age = ?, gender = ?, emergency_contact = ?, medical_history = ?, insurance_details = ? WHERE patientID = ?",
      [
        first_name,
        last_name,
        email,
        contact_no,
        age,
        gender,
        emergency_contact,
        medical_history,
        insurance_details,
        patientId,
      ]
    );

    // Return updated patient
    const [updatedPatient] = await pool.query(
      "SELECT * FROM Patient WHERE patientID = ?",
      [patientId]
    );

    if (updatedPatient.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({
      message: "Patient updated successfully",
      patientID: patientId,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    handleDatabaseError(error, res);
  }
});

// Delete patient endpoint
app.delete("/api/patients/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    console.log("Received request to delete patient with ID:", patientId);

    // Check if patient exists
    const [patient] = await pool.query(
      "SELECT * FROM Patient WHERE patientID = ?",
      [patientId]
    );

    if (patient.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Delete patient
    await pool.query("DELETE FROM Patient WHERE patientID = ?", [patientId]);

    res.json({
      message: "Patient deleted successfully",
      patientID: patientId,
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    handleDatabaseError(error, res);
  }
});

// Add doctor endpoint
app.post("/api/doctors", async (req, res) => {
  try {
    console.log("Received doctor data:", req.body);

    const {
      first_name,
      last_name,
      specialization,
      department,
      phone_no,
      email,
      qualifications,
    } = req.body;

    // Check for required fields
    const requiredFields = {
      first_name,
      last_name,
      specialization,
      department,
      phone_no,
      email,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value && value !== 0)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log("Missing doctor fields:", missingFields);
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        receivedEmail: email,
      });
    }

    // Validate phone number
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    const cleanPhoneNo = phone_no.replace(/\s/g, "");

    if (!phoneRegex.test(cleanPhoneNo)) {
      return res.status(400).json({
        error: "Phone Number must be at least 10 digits",
        receivedPhoneNo: phone_no,
      });
    }

    const query = `
      INSERT INTO Doctor (
        first_name, last_name, specialization, department, 
        phone_no, email, qualifications, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
    `;

    const [result] = await pool.query(query, [
      first_name,
      last_name,
      specialization,
      department,
      phone_no,
      email,
      qualifications || "",
    ]);

    res.status(201).json({
      message: "Doctor added successfully",
      doctorID: result.insertId,
    });
  } catch (error) {
    console.error("Unexpected error adding doctor:", error);
    res.status(500).json({
      error: "An unexpected error occurred",
      details: error.message,
    });
  }
});

// Update doctor endpoint
app.put("/api/doctors/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    console.log("Updating doctor ID:", doctorId);
    console.log("Update doctor data:", req.body);

    const {
      first_name,
      last_name,
      specialization,
      department,
      phone_no,
      email,
      qualifications,
      status,
    } = req.body;

    // Check for required fields
    const requiredFields = {
      first_name,
      last_name,
      specialization,
      department,
      phone_no,
      email,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value && value !== 0)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log("Missing doctor fields:", missingFields);
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        receivedEmail: email,
      });
    }

    // Validate phone number
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    const cleanPhoneNo = phone_no.replace(/\s/g, "");

    if (!phoneRegex.test(cleanPhoneNo)) {
      return res.status(400).json({
        error: "Phone Number must be at least 10 digits",
        receivedPhoneNo: phone_no,
      });
    }

    // Validate status
    const validStatus = ["Active", "Inactive", "On Leave"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        error:
          "Invalid status value. Must be one of: Active, Inactive, On Leave",
        receivedStatus: status,
      });
    }

    const query = `
      UPDATE Doctor 
      SET first_name = ?, 
          last_name = ?, 
          specialization = ?,
          department = ?,
          phone_no = ?,
          email = ?,
          qualifications = ?,
          status = ?
      WHERE doctorID = ?
    `;

    const [result] = await pool.query(query, [
      first_name,
      last_name,
      specialization,
      department,
      phone_no,
      email,
      qualifications || "",
      status || "Active",
      doctorId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({
      message: "Doctor updated successfully",
      doctorID: doctorId,
    });
  } catch (error) {
    console.error("Unexpected error updating doctor:", error);
    res.status(500).json({
      error: "An unexpected error occurred",
      details: error.message,
    });
  }
});

// Delete doctor endpoint
app.delete("/api/doctors/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    console.log("Received request to delete doctor with ID:", doctorId);

    const query = "DELETE FROM Doctor WHERE doctorID = ?";

    const [result] = await pool.query(query, [doctorId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({
      message: "Doctor deleted successfully",
      doctorID: doctorId,
    });
  } catch (error) {
    console.error("Unexpected error during doctor deletion:", error);
    res.status(500).json({
      error: "An unexpected error occurred",
      details: error.message,
    });
  }
});

// COUNT API ENDPOINTS for dashboard stats
app.get("/api/doctors/count", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT COUNT(*) as count FROM Doctor");
    res.json({ count: results[0].count });
  } catch (error) {
    console.error("Error getting doctor count:", error);
    handleDatabaseError(error, res);
  }
});

app.get("/api/patients/count", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT COUNT(*) as count FROM Patient");
    res.json({ count: results[0].count });
  } catch (error) {
    console.error("Error getting patient count:", error);
    handleDatabaseError(error, res);
  }
});

app.get("/api/appointments/count", async (req, res) => {
  try {
    const [results] = await pool.query(
      "SELECT COUNT(*) as count FROM Appointment"
    );
    res.json({ count: results[0].count });
  } catch (error) {
    console.error("Error getting appointment count:", error);
    handleDatabaseError(error, res);
  }
});

// NOTIFICATIONS API
app.get("/api/notifications", async (req, res) => {
  try {
    // For now, return mock notifications
    // In a real implementation, this would fetch from a notifications table
    const mockNotifications = [
      {
        id: 1,
        type: "appointment",
        message: "New appointment scheduled with Dr. Smith",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
      },
      {
        id: 2,
        type: "consultation",
        message: "Consultation notes updated for patient Johnson",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        read: true,
      },
      {
        id: 3,
        type: "patient",
        message: "New patient registered: Maria Garcia",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        read: false,
      },
      {
        id: 4,
        type: "doctor",
        message: "Dr. Patel updated availability schedule",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
      },
    ];

    res.json(mockNotifications);
  } catch (error) {
    console.error("Error getting recent notifications:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get available time slots for a doctor on a specific date
app.post("/api/appointments/available-slots", async (req, res) => {
  try {
    const { doctorID, date } = req.body;

    if (!doctorID || !date) {
      return res.status(400).json({ error: "Doctor ID and date are required" });
    }

    // Get all appointments for the doctor on the specified date
    const [appointments] = await pool.query(
      "SELECT appTime FROM Appointment WHERE doctorID = ? AND appDate = ? AND status != 'Cancelled'",
      [doctorID, date]
    );

    // Generate all possible time slots (9 AM to 5 PM, 30-minute intervals)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        allSlots.push(time);
      }
    }

    // Filter out booked slots
    const bookedSlots = appointments.map((apt) => apt.appTime);
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({ slots: availableSlots });
  } catch (error) {
    console.error("Error getting available slots:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create appointment endpoint
app.post("/api/appointments", async (req, res) => {
  try {
    const { patientID, doctorID, appDate, appTime, status, notes } = req.body;

    // Validate required fields
    if (!patientID || !doctorID || !appDate || !appTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the time slot is available
    const [existingAppointments] = await pool.query(
      "SELECT * FROM Appointment WHERE doctorID = ? AND appDate = ? AND appTime = ? AND status != 'Cancelled'",
      [doctorID, appDate, appTime]
    );

    if (existingAppointments.length > 0) {
      return res
        .status(400)
        .json({ error: "This time slot is already booked" });
    }

    // Create appointment
    const [result] = await pool.query(
      "INSERT INTO Appointment (patientID, doctorID, appDate, appTime, status, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [
        patientID,
        doctorID,
        appDate,
        appTime,
        status || "Scheduled",
        notes || null,
      ]
    );

    const appointmentID = result.insertId;

    // Return created appointment
    const [newAppointment] = await pool.query(
      "SELECT * FROM Appointment WHERE appID = ?",
      [appointmentID]
    );

    res.status(201).json(newAppointment[0]);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.setHeader("Content-Type", "application/json");
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
