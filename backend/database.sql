-- Drop existing database if exists and create new one
DROP DATABASE IF EXISTS hospitalsystem;
CREATE DATABASE hospitalsystem;
USE hospitalsystem;

-- Create Patient table with improved constraints
CREATE TABLE Patient (
    patientID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT NOT NULL CHECK (age > 0 AND age < 150),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    emergency_contact VARCHAR(20) NOT NULL,
    medical_history TEXT,
    insurance_details TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_contact (contact_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Doctor table with improved constraints
CREATE TABLE Doctor (
    doctorID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    phone_no VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    qualifications TEXT,
    status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone_no),
    INDEX idx_specialization (specialization)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Appointment table with improved constraints
CREATE TABLE Appointment (
    appID INT AUTO_INCREMENT PRIMARY KEY,
    patientID INT NOT NULL,
    doctorID INT NOT NULL,
    appDate DATE NOT NULL,
    appTime TIME NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled', 'No Show') DEFAULT 'Scheduled',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientID) REFERENCES Patient(patientID) ON DELETE CASCADE,
    FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID) ON DELETE CASCADE,
    INDEX idx_date (appDate),
    INDEX idx_status (status),
    UNIQUE KEY unique_appointment (doctorID, appDate, appTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Consultation table with improved constraints
CREATE TABLE Consultation (
    consultationID INT AUTO_INCREMENT PRIMARY KEY,
    appointmentID INT NOT NULL,
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    follow_up_date DATE,
    follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointmentID) REFERENCES Appointment(appID) ON DELETE CASCADE,
    INDEX idx_follow_up (follow_up_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Medical Records table for better patient history tracking
CREATE TABLE MedicalRecord (
    recordID INT AUTO_INCREMENT PRIMARY KEY,
    patientID INT NOT NULL,
    doctorID INT NOT NULL,
    consultationID INT,
    record_type ENUM('Lab Result', 'Imaging', 'Vaccination', 'Procedure', 'Other') NOT NULL,
    record_date DATE NOT NULL,
    description TEXT,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientID) REFERENCES Patient(patientID) ON DELETE CASCADE,
    FOREIGN KEY (doctorID) REFERENCES Doctor(doctorID) ON DELETE CASCADE,
    FOREIGN KEY (consultationID) REFERENCES Consultation(consultationID) ON DELETE SET NULL,
    INDEX idx_patient (patientID),
    INDEX idx_date (record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Billing table for financial tracking
CREATE TABLE Billing (
    billID INT AUTO_INCREMENT PRIMARY KEY,
    patientID INT NOT NULL,
    appointmentID INT,
    consultationID INT,
    bill_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Partially Paid', 'Cancelled') DEFAULT 'Pending',
    payment_method ENUM('Cash', 'Insurance', 'Credit Card', 'Debit Card', 'Online') DEFAULT 'Cash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientID) REFERENCES Patient(patientID) ON DELETE CASCADE,
    FOREIGN KEY (appointmentID) REFERENCES Appointment(appID) ON DELETE SET NULL,
    FOREIGN KEY (consultationID) REFERENCES Consultation(consultationID) ON DELETE SET NULL,
    INDEX idx_patient (patientID),
    INDEX idx_date (bill_date),
    INDEX idx_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create consultations table if it doesn't exist
CREATE TABLE IF NOT EXISTS consultations (
  consultationID INT AUTO_INCREMENT PRIMARY KEY,
  appointmentID INT NOT NULL,
  consultationType VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  diagnosis TEXT,
  prescription TEXT,
  notes TEXT,
  needsTests BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'Scheduled',
  FOREIGN KEY (appointmentID) REFERENCES appointments(appID) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultations_appointment ON consultations(appointmentID);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status); 