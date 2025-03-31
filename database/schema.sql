-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hospitalsystem;
USE hospitalsystem;

CREATE TABLE Patient (
    patientID INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL, -- Use ENUM for gender
    contact_no VARCHAR(20) NOT NULL, -- Phone numbers can have various formats, use VARCHAR
    email VARCHAR(50) NOT NULL UNIQUE, -- Emails should be unique
    emergency_contact VARCHAR(20) NOT NULL, -- Same as contact_no
    medical_history TEXT, -- Use TEXT for longer text fields
    insurance_details TEXT 
);

CREATE TABLE Doctor (
    doctorID INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(50) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE, -- Emails should be unique
    qualification VARCHAR(50) NOT NULL,
    experience INT NOT NULL,
    department VARCHAR(50) NOT NULL
);

CREATE TABLE Consultation (
    consultationID INT PRIMARY KEY,
    patientID INT NOT NULL,
    doctorID INT NOT NULL,
    consultation_date DATE NOT NULL,
    consultation_time TIME NOT NULL, -- Use TIME for time
    symptoms_description TEXT, -- Use TEXT for longer text fields
    diagnosis TEXT, -- Use TEXT for longer text fields
    prescription TEXT, -- Use TEXT for longer text fields
    treatment_recommendation TEXT, -- Use TEXT for longer text fields
    FOREIGN KEY (patientID) REFERENCES Patient(patientID),
    FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID)
);

CREATE TABLE Appointment (
    appointmentID INT PRIMARY KEY,
    patientID INT NOT NULL,
    doctorID INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL, -- Use TIME for time
    status ENUM('Scheduled', 'Completed', 'Cancelled') NOT NULL, -- Use ENUM for status
    FOREIGN KEY (patientID) REFERENCES Patient(patientID),
    FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID)
);

CREATE TABLE Prescription (
    prescriptionID INT PRIMARY KEY,
    consultationID INT NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    instructions VARCHAR(50) NOT NULL, -- Renamed for clarity
    FOREIGN KEY (consultationID) REFERENCES Consultation(consultationID)
);

CREATE TABLE Medical_Record (
    recordID INT PRIMARY KEY,
    patientID INT NOT NULL,
    record_date DATE NOT NULL,
    record_type VARCHAR(50) NOT NULL,
    description TEXT, -- Use TEXT for longer text fields
    test_result TEXT, -- Use TEXT for longer text fields
    FOREIGN KEY (patientID) REFERENCES Patient(patientID)
);

CREATE TABLE Billing (
    billingID INT PRIMARY KEY,
    patientID INT NOT NULL,
    consultationID INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('Paid', 'Unpaid', 'Pending') NOT NULL, -- Use ENUM for status
    FOREIGN KEY (patientID) REFERENCES Patient(patientID),
    FOREIGN KEY (consultationID) REFERENCES Consultation(consultationID)
);

CREATE TABLE Room (
    roomID INT PRIMARY KEY,
    room_number INT NOT NULL UNIQUE, -- Room numbers should be unique
    room_type VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    room_status ENUM('Available', 'Occupied', 'Maintenance') NOT NULL, -- Use ENUM for status
    patientID INT, -- Allow null if room is unoccupied
    FOREIGN KEY (patientID) REFERENCES Patient(patientID)
);

CREATE TABLE Staff (
    staffID INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    phone_no VARCHAR(20) NOT NULL, -- Same as contact_no and others
    email VARCHAR(100) NOT NULL UNIQUE -- Emails should be unique
);

CREATE TABLE Department (
    departmentID INT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL UNIQUE,  -- Department names should be unique
    department_head VARCHAR(50), -- Allow null if no head assigned yet
    FOREIGN KEY (department_head) REFERENCES Staff(staffID) -- Added this foreign key
);


CREATE TABLE Insurance (
    insuranceID INT PRIMARY KEY,
    patientID INT NOT NULL,
    insurance_provider VARCHAR(50) NOT NULL,
    policy_no VARCHAR(50) NOT NULL, -- Policy numbers can have letters and other characters
    coverage_details TEXT, -- Use TEXT for longer text fields
    FOREIGN KEY (patientID) REFERENCES Patient(patientID)
);

-- -- Patient table
-- CREATE TABLE IF NOT EXISTS Patient (
--     patientID INT AUTO_INCREMENT PRIMARY KEY,
--     first_name VARCHAR(50) NOT NULL,
--     last_name VARCHAR(50) NOT NULL,
--     Age INT NOT NULL,
--     Gender VARCHAR(10) NOT NULL,
--     ContactNo VARCHAR(15) NOT NULL,
--     Email VARCHAR(100) NOT NULL,
--     EmergencyContact VARCHAR(15) NOT NULL,
--     Medical_history TEXT NOT NULL,
--     Insurance_details VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- -- Doctor table
-- CREATE TABLE IF NOT EXISTS Doctor (
--     DoctorID INT AUTO_INCREMENT PRIMARY KEY,
--     first_name VARCHAR(50) NOT NULL,
--     last_name VARCHAR(50) NOT NULL,
--     Specialization VARCHAR(100) NOT NULL,
--     Department VARCHAR(50) NOT NULL,
--     PhoneNo VARCHAR(15) NOT NULL,
--     Email VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- -- Appointment table
-- CREATE TABLE IF NOT EXISTS Appointment (
--     appID INT AUTO_INCREMENT PRIMARY KEY,
--     patientID INT NOT NULL,
--     doctorID INT NOT NULL,
--     appDate DATE NOT NULL,
--     appTime TIME NOT NULL,
--     status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
--     reason TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (patientID) REFERENCES Patient(patientID),
--     FOREIGN KEY (doctorID) REFERENCES Doctor(DoctorID)
-- );

-- -- Consultation table
-- CREATE TABLE IF NOT EXISTS Consultation (
--     consultationID INT AUTO_INCREMENT PRIMARY KEY,
--     appointmentID INT NOT NULL,
--     diagnosis TEXT,
--     prescription TEXT,
--     notes TEXT,
--     followup_date DATE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (appointmentID) REFERENCES Appointment(appID)
-- );

-- -- Billing table
-- CREATE TABLE IF NOT EXISTS Billing (
--     billingID INT AUTO_INCREMENT PRIMARY KEY,
--     consultationID INT NOT NULL,
--     amount DECIMAL(10,2) NOT NULL,
--     payment_status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
--     payment_date DATETIME,
--     payment_method VARCHAR(50),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (consultationID) REFERENCES Consultation(consultationID)
-- );

-- -- Insert sample data for testing
-- INSERT INTO Patient (first_name, last_name, Age, Gender, ContactNo, Email, EmergencyContact, Medical_history, Insurance_details)
-- VALUES 
-- ('John', 'Doe', 35, 'Male', '123-456-7890', 'john.doe@email.com', '987-654-3210', 'No major issues', 'Insurance A123'),
-- ('Jane', 'Smith', 28, 'Female', '234-567-8901', 'jane.smith@email.com', '876-543-2109', 'Allergic to penicillin', 'Insurance B456');

-- INSERT INTO Doctor (first_name, last_name, Specialization, Department, PhoneNo, Email)
-- VALUES 
-- ('David', 'Wilson', 'Cardiology', 'Heart Center', '345-678-9012', 'david.wilson@hospital.com'),
-- ('Sarah', 'Johnson', 'Pediatrics', 'Children Care', '456-789-0123', 'sarah.johnson@hospital.com');

-- INSERT INTO Appointment (patientID, doctorID, appDate, appTime, status, reason)
-- VALUES 
-- (1, 1, CURDATE(), '10:00:00', 'scheduled', 'Regular checkup'),
-- (2, 2, CURDATE(), '14:30:00', 'scheduled', 'Follow-up appointment'); 