// Main JavaScript file for Hospital Consultation System

// Constants
const API_BASE_URL = "http://localhost:5001";
const mainContent = document.getElementById("main-content");

// Utility functions
const showLoading = () => {
  document.getElementById("loadingOverlay").classList.remove("d-none");
};

const hideLoading = () => {
  document.getElementById("loadingOverlay").classList.add("d-none");
};

const showError = (message) => {
  hideLoading();
  const errorToast = document.getElementById("errorToast");
  document.getElementById("errorMessage").textContent =
    message || "An error occurred";
  const toast = new bootstrap.Toast(errorToast);
  toast.show();
};

const showSuccess = (message) => {
  hideLoading();
  const successToast = document.getElementById("successToast");
  document.getElementById("successMessage").textContent =
    message || "Operation successful";
  const toast = new bootstrap.Toast(successToast);
  toast.show();
};

// API configuration
const api = {
  baseURL: "http://localhost:5001/api",

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      throw error;
    }
  },
};

// Page handlers
const pageHandlers = {
  home: async () => {
    try {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `
        <div class="container py-5">
          <div class="row mb-5">
            <div class="col-12 text-center">
              <h1 class="display-4 mb-3">Welcome to Hospital Consultation System</h1>
              <p class="lead">Your trusted platform for managing medical consultations and appointments</p>
            </div>
          </div>

          <div class="row mb-5">
            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                  <i class="fas fa-calendar-check fa-3x text-primary mb-3"></i>
                  <h3 class="card-title">Schedule Consultation</h3>
                  <p class="card-text">Book an appointment with our experienced doctors</p>
                  <a href="#book-consultation" class="btn btn-primary">Book Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                  <i class="fas fa-user-md fa-3x text-primary mb-3"></i>
                  <h3 class="card-title">Find Doctors</h3>
                  <p class="card-text">Browse our team of specialized medical professionals</p>
                  <a href="#doctors" class="btn btn-primary">View Doctors</a>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                  <i class="fas fa-clipboard-list fa-3x text-primary mb-3"></i>
                  <h3 class="card-title">My Consultations</h3>
                  <p class="card-text">View and manage your consultation history</p>
                  <a href="#consultations" class="btn btn-primary">View Consultations</a>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h3 class="card-title">Quick Stats</h3>
                  <div class="row text-center">
                    <div class="col-6">
                      <h4 class="text-primary" id="doctorCount">-</h4>
                      <p>Doctors</p>
                    </div>
                    <div class="col-6">
                      <h4 class="text-primary" id="patientCount">-</h4>
                      <p>Patients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h3 class="card-title">Recent Notifications</h3>
                  <div id="recentNotifications">
                    <div class="text-center">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h3 class="card-title">Quick Start Guide</h3>
                  <div class="accordion" id="quickStartGuide">
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#step1">
                          Step 1: Book a Consultation
                        </button>
                      </h2>
                      <div id="step1" class="accordion-collapse collapse show" data-bs-parent="#quickStartGuide">
                        <div class="accordion-body">
                          Click the "Book Now" button above to schedule a consultation with one of our doctors.
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step2">
                          Step 2: Select a Doctor
                        </button>
                      </h2>
                      <div id="step2" class="accordion-collapse collapse" data-bs-parent="#quickStartGuide">
                        <div class="accordion-body">
                          Choose from our team of experienced doctors based on their specialization.
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step3">
                          Step 3: Choose Time Slot
                        </button>
                      </h2>
                      <div id="step3" class="accordion-collapse collapse" data-bs-parent="#quickStartGuide">
                        <div class="accordion-body">
                          Select an available time slot that works best for you.
                        </div>
                      </div>
                    </div>
                    <div class="accordion-item">
                      <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#step4">
                          Step 4: Confirm Booking
                        </button>
                      </h2>
                      <div id="step4" class="accordion-collapse collapse" data-bs-parent="#quickStartGuide">
                        <div class="accordion-body">
                          Review your booking details and confirm to complete the process.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Load quick stats
      try {
        const [doctors, patients] = await Promise.all([
          api.get("doctors"),
          api.get("patients"),
        ]);
        document.getElementById("doctorCount").textContent = doctors.length;
        document.getElementById("patientCount").textContent = patients.length;
      } catch (error) {
        console.error("Error loading quick stats:", error);
      }

      // Load recent notifications
      try {
        const notifications = await api.get("notifications");
        const notificationsContainer = document.getElementById(
          "recentNotifications"
        );
        if (notifications && notifications.length > 0) {
          notificationsContainer.innerHTML = notifications
            .slice(0, 5) // Show only the 5 most recent notifications
            .map(
              (notification) => `
              <div class="notification-item ${
                notification.read ? "text-muted" : ""
              } mb-2">
                <i class="fas ${getNotificationIcon(
                  notification.type
                )} me-2"></i>
                ${notification.message}
                <small class="text-muted ms-2">${formatTimeAgo(
                  notification.timestamp
                )}</small>
              </div>
            `
            )
            .join("");
        } else {
          notificationsContainer.innerHTML =
            '<p class="text-muted">No recent notifications</p>';
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
        document.getElementById("recentNotifications").innerHTML =
          '<p class="text-muted">Unable to load notifications</p>';
      }
    } catch (error) {
      console.error("Error loading home page:", error);
      showError("Failed to load home page");
    }
  },

  async patients() {
    showLoading();
    try {
      const patients = await api.get("patients");
      const content = `
        <div class="patients-page">
                <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="patients-header">
              <h2>Patients Management</h2>
            </div>
            <button class="btn btn-primary add-patient-btn" onclick="patientForm.showAddForm()">
              <i class="fas fa-user-plus"></i> Add New Patient
            </button>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${patients
                              .map(
                                (patient) => `
                                <tr>
                                    <td>${patient.patientID}</td>
                                    <td>${patient.first_name} ${
                                  patient.last_name
                                }</td>
                                    <td>${patient.age}</td>
                                    <td>${patient.gender}</td>
                                    <td>${patient.contact_no}</td>
                                    <td>${patient.email}</td>
                                    <td class="action-buttons">
                                      <button class="btn btn-info" onclick='patientForm.showViewDetails(${JSON.stringify(
                                        patient
                                      ).replace(/'/g, "\\'")})'>
                                        <i class="fas fa-eye"></i> View
                                      </button>
                                      <button class="btn btn-primary" onclick='patientForm.showEditForm(${JSON.stringify(
                                        patient
                                      ).replace(/'/g, "\\'")})'>
                                        <i class="fas fa-edit"></i> Edit
                                      </button>
                                      <button class="btn btn-danger" onclick='patientForm.confirmDelete(${
                                        patient.patientID
                                      })'>
                                        <i class="fas fa-trash-alt"></i> Delete
                                      </button>
                                    </td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
                </div>
            `;
      document.getElementById("main-content").innerHTML = content;
    } catch (error) {
      showError("Failed to load patients");
    }
  },

  async doctors() {
    try {
      const mainContent = document.getElementById("main-content");

      // Show immediate placeholder UI while loading
      mainContent.innerHTML = `
        <div class="doctors-page">
                <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="doctors-header">
              <h2>Doctors Management</h2>
                </div>
            <button class="btn btn-primary add-doctor-btn" onclick="doctorForm.showAddForm()">
              <i class="fas fa-user-md"></i> Add New Doctor
            </button>
          </div>
          
          <div class="doctors-loading">
            <div class="text-center py-3">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading doctors...</p>
            </div>
          </div>
          
          <div class="table-responsive d-none" id="doctors-table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Department</th>
                                <th>Contact</th>
                  <th>Email</th>
                  <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
              <tbody id="doctors-table-body">
                <!-- Doctor data will be loaded here -->
                        </tbody>
                    </table>
          </div>
          
          <div id="doctors-error" class="alert alert-danger d-none">
            <!-- Error message will appear here -->
          </div>
          
          <div id="doctors-empty" class="alert alert-info d-none">
            <i class="fas fa-info-circle"></i> No doctors found. 
            Click the "Add New Doctor" button to add your first doctor.
          </div>
                </div>
            `;

      // Set a timeout for slow responses
      const timeoutId = setTimeout(() => {
        document.querySelector(".doctors-loading p").textContent =
          "Loading is taking longer than expected. Please wait...";
      }, 3000);

      try {
        // Fetch doctors data
        const doctors = await api.get("doctors");

        // Handle the response
        clearTimeout(timeoutId);
        document.querySelector(".doctors-loading").classList.add("d-none");

        if (!Array.isArray(doctors)) {
          throw new Error("Received invalid data format from server");
        }

        if (doctors.length === 0) {
          document.getElementById("doctors-empty").classList.remove("d-none");
          return;
        }

        // Build table rows incrementally for better performance
        const tbody = document.getElementById("doctors-table-body");
        doctors.forEach((doctor) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${doctor.doctorID}</td>
            <td>${doctor.first_name} ${doctor.last_name}</td>
            <td>${doctor.specialization}</td>
            <td>${doctor.department}</td>
            <td>${doctor.phone_no}</td>
            <td>${doctor.email}</td>
            <td><span class="badge ${
              doctor.status === "Active"
                ? "bg-success"
                : doctor.status === "Inactive"
                ? "bg-danger"
                : "bg-warning"
            }">${doctor.status || "Active"}</span></td>
            <td class="action-buttons">
              <button class="btn btn-info" onclick='doctorForm.showViewDetails(${JSON.stringify(
                doctor
              ).replace(/'/g, "\\'")})'>
                <i class="fas fa-eye"></i> View
              </button>
              <button class="btn btn-primary" onclick='doctorForm.showEditForm(${JSON.stringify(
                doctor
              ).replace(/'/g, "\\'")})'>
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn btn-danger" onclick='doctorForm.confirmDelete(${
                doctor.doctorID
              })'>
                <i class="fas fa-trash-alt"></i> Delete
              </button>
            </td>
          `;
          tbody.appendChild(tr);
        });

        // Show the table
        document
          .getElementById("doctors-table-container")
          .classList.remove("d-none");
      } catch (error) {
        clearTimeout(timeoutId);
        document.querySelector(".doctors-loading").classList.add("d-none");

        const errorEl = document.getElementById("doctors-error");
        errorEl.innerHTML = `
          <h4><i class="fas fa-exclamation-circle"></i> Error Loading Doctors</h4>
          <p>${
            error.message || "Failed to load doctors data from the server."
          }</p>
          <button class="btn btn-outline-danger mt-2" onclick="pageHandlers.doctors()">
            <i class="fas fa-sync"></i> Try Again
          </button>
        `;
        errorEl.classList.remove("d-none");
      }
    } catch (error) {
      console.error("Fatal error in doctors page handler:", error);
      document.getElementById("main-content").innerHTML = `
        <div class="alert alert-danger">
          <h4><i class="fas fa-exclamation-triangle"></i> Error</h4>
          <p>An unexpected error occurred while loading the doctors page.</p>
          <button class="btn btn-outline-danger" onclick="pageHandlers.doctors()">
            <i class="fas fa-sync"></i> Try Again
          </button>
        </div>
      `;
    }
  },

  async appointments() {
    showLoading();
    try {
      const appointments = await api.get("appointments");
      const content = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Appointments Management</h2>
                    <button class="btn btn-primary" onclick="appointmentForm.showAddForm()">
                      <i class="fas fa-calendar-plus"></i> New Appointment
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appointments
                              .map(
                                (appointment) => `
                                <tr>
                                    <td>${appointment.appID}</td>
                                    <td>${appointment.patientName}</td>
                                    <td>${appointment.doctorName}</td>
                                    <td>${appointment.appDate}</td>
                                    <td>${appointment.appTime}</td>
                                    <td><span class="badge badge-${getStatusBadgeClass(
                                      appointment.status
                                    )}">${appointment.status}</span></td>
                                    <td class="action-buttons">
                                      <button class="btn btn-info" onclick="appointmentForm.showViewDetails(${JSON.stringify(
                                        appointment
                                      ).replace(/"/g, "&quot;")})">
                                        <i class="fas fa-eye"></i> View
                                      </button>
                                      <button class="btn btn-primary" onclick="appointmentForm.showEditForm(${JSON.stringify(
                                        appointment
                                      ).replace(/"/g, "&quot;")})">
                                        <i class="fas fa-edit"></i> Edit
                                      </button>
                                      <button class="btn btn-danger" onclick="appointmentForm.confirmDelete(${
                                        appointment.appID
                                      })">
                                        <i class="fas fa-trash-alt"></i> Delete
                                      </button>
                                    </td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            `;
      document.getElementById("main-content").innerHTML = content;
    } catch (error) {
      showError("Failed to load appointments");
    }
  },

  async consultations() {
    document.title = "Consultations | Hospital Consultation System";
    mainContent.innerHTML = `
      <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0"><i class="fas fa-comments-medical me-2"></i>Consultations Management</h2>
          <button class="btn btn-primary add-btn" onclick="consultationForm.showAddForm()">
            <i class="fas fa-plus"></i> Schedule New Consultation
          </button>
        </div>
        
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <div class="row">
              <div class="col-md-8">
                <h5 class="mb-0">All Consultations</h5>
              </div>
              <div class="col-md-4">
                <input type="text" class="form-control" id="consultationSearch" placeholder="Search consultations...">
              </div>
            </div>
          </div>
          <div class="card-body p-0">
            <div id="loadingConsultations" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading consultations...</p>
            </div>
            <div id="consultationsError" class="alert alert-danger m-3 d-none"></div>
            <div id="consultationsTable" class="table-responsive d-none">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody id="consultationsData">
                  <!-- Consultations will be loaded here -->
                </tbody>
              </table>
            </div>
            <div id="noConsultations" class="text-center py-4 d-none">
              <div class="py-5">
                <i class="fas fa-calendar-times fa-4x text-muted mb-3"></i>
                <h5>No consultations found</h5>
                <p class="text-muted">Schedule your first consultation to get started</p>
                <button class="btn btn-primary mt-2" onclick="consultationForm.showAddForm()">
                  <i class="fas fa-plus"></i> Schedule New Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Define elements
    const loadingEl = document.getElementById("loadingConsultations");
    const tableEl = document.getElementById("consultationsTable");
    const errorEl = document.getElementById("consultationsError");
    const noDataEl = document.getElementById("noConsultations");
    const tableDataEl = document.getElementById("consultationsData");
    const searchInput = document.getElementById("consultationSearch");

    let consultations = [];

    try {
      // Fetch consultations from API
      consultations = await api.get("consultations");

      if (consultations.length === 0) {
        loadingEl.classList.add("d-none");
        noDataEl.classList.remove("d-none");
        return;
      }

      // Render consultations
      renderConsultations(consultations);

      // Add search functionality
      searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = consultations.filter(
          (consultation) =>
            consultation.patient_name?.toLowerCase().includes(searchTerm) ||
            consultation.patient_last_name
              ?.toLowerCase()
              .includes(searchTerm) ||
            consultation.doctor_name?.toLowerCase().includes(searchTerm) ||
            consultation.doctor_last_name?.toLowerCase().includes(searchTerm) ||
            consultation.consultationType?.toLowerCase().includes(searchTerm) ||
            consultation.status?.toLowerCase().includes(searchTerm)
        );
        renderConsultations(filtered);
      });
    } catch (error) {
      console.error("Error loading consultations:", error);
      loadingEl.classList.add("d-none");
      errorEl.classList.remove("d-none");
      errorEl.textContent =
        error.message || "Failed to load consultations. Please try again.";

      // Add retry button
      errorEl.innerHTML += `
        <button class="btn btn-outline-primary mt-3" onclick="pageHandlers.consultations()">
          <i class="fas fa-sync"></i> Try Again
        </button>
      `;
    }

    function renderConsultations(data) {
      loadingEl.classList.add("d-none");

      if (data.length === 0) {
        tableEl.classList.add("d-none");
        noDataEl.classList.remove("d-none");
        return;
      }

      tableEl.classList.remove("d-none");
      noDataEl.classList.add("d-none");

      // Sort consultations by date (most recent first)
      data.sort((a, b) => {
        const dateA = new Date(`${a.appDate}T${a.appTime}`);
        const dateB = new Date(`${b.appDate}T${b.appTime}`);
        return dateB - dateA;
      });

      // Generate table rows
      tableDataEl.innerHTML = data
        .map((consultation) => {
          // Format date and time
          const date = new Date(consultation.appDate);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = consultation.appTime
            ? consultation.appTime.substring(0, 5)
            : "";

          return `
          <tr>
            <td>C-${consultation.consultationID}</td>
            <td>${consultation.patient_name} ${
            consultation.patient_last_name || ""
          }</td>
            <td>${consultation.doctor_name} ${
            consultation.doctor_last_name || ""
          }</td>
            <td>${formattedDate} at ${formattedTime}</td>
            <td>${consultation.consultationType || "Not specified"}</td>
            <td>
              <span class="badge ${
                consultation.status === "Completed"
                  ? "bg-success"
                  : consultation.status === "Scheduled"
                  ? "bg-primary"
                  : consultation.status === "In Progress"
                  ? "bg-warning text-dark"
                  : consultation.status === "Cancelled"
                  ? "bg-danger"
                  : "bg-secondary"
              }">${consultation.status || "Not specified"}</span>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-info me-1" title="View Details" onclick='consultationForm.showViewDetails(${JSON.stringify(
                consultation
              ).replace(/'/g, "\\'")})'>
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-primary me-1" title="Edit Consultation" onclick='consultationForm.showEditForm(${JSON.stringify(
                consultation
              ).replace(/'/g, "\\'")})'><i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-danger" title="Delete Consultation" onclick="consultationForm.confirmDelete(${
                consultation.consultationID
              })"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        `;
        })
        .join("");
    }
  },

  async bookConsultation() {
    showLoading();
    try {
      console.log("Loading book consultation page...");
      const doctors = await api.get("doctors");
      console.log("Loaded doctors:", doctors);

      const content = `
        <div class="booking-form">
          <h2 class="mb-4">Book a Consultation</h2>
          <div class="booking-steps">
            <div class="booking-step">
              <div class="step-number active">1</div>
              <div class="step-title active">Patient Information</div>
            </div>
            <div class="booking-step">
              <div class="step-number">2</div>
              <div class="step-title">Select Doctor</div>
            </div>
            <div class="booking-step">
              <div class="step-number">3</div>
              <div class="step-title">Book Appointment</div>
            </div>
          </div>

          <form id="patientBookingForm" onsubmit="bookingForm.handlePatientSubmit(event)">
            <h3 class="mb-4">Patient Information</h3>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="first_name" class="form-label">First Name</label>
                <input type="text" class="form-control" id="first_name" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="last_name" class="form-label">Last Name</label>
                <input type="text" class="form-control" id="last_name" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="tel" class="form-control" id="phone" required pattern="[0-9-+()]{10,}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="age" class="form-label">Age</label>
                <input type="number" class="form-control" id="age" required min="0" max="150">
              </div>
              <div class="col-md-6 mb-3">
                <label for="gender" class="form-label">Gender</label>
                <select class="form-control" id="gender" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="consultation_type" class="form-label">Consultation Type</label>
                <select class="form-control" id="consultation_type" required>
                  <option value="">Select Type</option>
                  <option value="General">General Consultation</option>
                  <option value="Specialist">Specialist Consultation</option>
                  <option value="Follow-up">Follow-up Visit</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="preferred_date" class="form-label">Preferred Date</label>
                <input type="date" class="form-control" id="preferred_date" required min="${
                  new Date().toISOString().split("T")[0]
                }">
              </div>
            </div>
            <div class="mb-3">
              <label for="symptoms" class="form-label">Symptoms/Reason for Visit</label>
              <textarea class="form-control" id="symptoms" rows="3" required></textarea>
            </div>
            <div id="formError" class="alert alert-danger d-none"></div>
            <div class="text-end">
              <button type="submit" class="btn btn-primary">Next: Select Doctor</button>
            </div>
          </form>

          <div id="doctorSelection" style="display: none;">
            <h3 class="mb-4">Select a Doctor</h3>
            <div class="row" id="doctorsList">
              ${doctors
                .map(
                  (doctor) => `
                <div class="col-md-6 mb-4">
                  <div class="doctor-card">
                    <h5>${doctor.first_name} ${doctor.last_name}</h5>
                    <p class="text-muted mb-2">${doctor.specialization}</p>
                    <p class="mb-2"><small>Department: ${doctor.department}</small></p>
                    <div class="doctor-availability available">Available</div>
                    <button type="button" class="btn btn-primary mt-3" onclick="bookingForm.selectDoctor(${doctor.doctorID})">
                      Select Doctor
                    </button>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <div id="timeSelection" style="display: none;">
            <h3 class="mb-4">Select Appointment Time</h3>
            <div id="timeSlots" class="mb-4">
              <!-- Time slots will be populated dynamically -->
            </div>
            <div class="text-end">
              <button type="button" class="btn btn-secondary me-2" onclick="bookingForm.showDoctorSelection()">Back</button>
              <button type="button" class="btn btn-primary" onclick="bookingForm.confirmBooking()">Confirm Booking</button>
            </div>
          </div>
        </div>
      `;
      document.getElementById("main-content").innerHTML = content;
    } catch (error) {
      showError("Failed to load booking form");
      console.error("Error loading booking form:", error);
    }
  },
};

// Helper functions
const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case "scheduled":
      return "warning";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "secondary";
  }
};

// Patient form handlers
const patientForm = {
  showAddForm() {
    const modal = new bootstrap.Modal(document.getElementById("formModal"));
    const modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Add New Patient</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div id="formError" class="alert alert-danger d-none"></div>
        <form id="addPatientForm" onsubmit="patientForm.handleAdd(event)">
          <div class="mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input type="text" class="form-control" id="firstName" required>
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" class="form-control" id="lastName" required>
          </div>
          <div class="mb-3">
            <label for="age" class="form-label">Age</label>
            <input type="number" class="form-control" id="age" required min="0" max="150">
          </div>
          <div class="mb-3">
            <label for="gender" class="form-label">Gender</label>
            <select class="form-select" id="gender" required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="contactNo" class="form-label">Contact Number</label>
            <input type="tel" class="form-control" id="contactNo" required pattern="[0-9\\-+()]{10,}" title="Please enter at least 10 digits">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" required>
          </div>
          <div class="mb-3">
            <label for="emergencyContact" class="form-label">Emergency Contact</label>
            <input type="tel" class="form-control" id="emergencyContact" required pattern="[0-9\\-+()]{10,}" title="Please enter at least 10 digits">
          </div>
          <div class="mb-3">
            <label for="medicalHistory" class="form-label">Medical History</label>
            <textarea class="form-control" id="medicalHistory" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label for="insuranceDetails" class="form-label">Insurance Details</label>
            <textarea class="form-control" id="insuranceDetails" rows="3" required></textarea>
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <textarea class="form-control" id="address" rows="3"></textarea>
          </div>
          <div class="text-end">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> Add Patient
            </button>
          </div>
        </form>
      </div>
    `;

    document.querySelector("#formModal .modal-content").innerHTML =
      modalContent;
    modal.show();
  },

  confirmDelete(patientID) {
    if (
      confirm(
        "Are you sure you want to delete this patient? This action cannot be undone."
      )
    ) {
      this.handleDelete(patientID);
    }
  },

  async handleDelete(patientID) {
    try {
      showLoading();
      await api.delete(`patients/${patientID}`);
      showSuccess("Patient deleted successfully");
      // Refresh the patients list
      await pageHandlers.patients();
    } catch (error) {
      console.error("Error deleting patient:", error);
      showError(error.message || "Failed to delete patient");
    }
  },

  async handleAdd(event) {
    event.preventDefault();
    try {
      const formData = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        age: parseInt(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        contact_no: document.getElementById("contactNo").value,
        email: document.getElementById("email").value,
        emergency_contact: document.getElementById("emergencyContact").value,
        medical_history: document.getElementById("medicalHistory").value,
        insurance_details: document.getElementById("insuranceDetails").value,
        address: document.getElementById("address").value || null,
      };

      console.log("Sending patient data:", formData);
      const response = await api.post("patients", formData);
      console.log("Server response:", response);

      // Close modal and refresh list
      bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
      await pageHandlers.patients();
      showSuccess("Patient added successfully");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert(error.message || "Error adding patient. Please try again.");
    }
  },

  showViewDetails(patient) {
    const modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Patient Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Personal Information</h6>
            <p><strong>Name:</strong> ${patient.first_name} ${
      patient.last_name
    }</p>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Address:</strong> ${
              patient.address || "Not provided"
            }</p>
          </div>
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Contact Information</h6>
            <p><strong>Contact:</strong> ${patient.contact_no}</p>
            <p><strong>Email:</strong> ${patient.email}</p>
            <p><strong>Emergency Contact:</strong> ${
              patient.emergency_contact
            }</p>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12">
            <h6 class="text-primary mb-3">Medical Information</h6>
            <p><strong>Medical History:</strong> ${
              patient.medical_history || "Not provided"
            }</p>
            <p><strong>Insurance Details:</strong> ${
              patient.insurance_details || "Not provided"
            }</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick='patientForm.showEditForm(${JSON.stringify(
          patient
        ).replace(/'/g, "\\'")})'>
          <i class="fas fa-edit"></i> Edit Patient
        </button>
      </div>
    `;

    document.querySelector("#formModal .modal-content").innerHTML =
      modalContent;
    new bootstrap.Modal(document.getElementById("formModal")).show();
  },

  showEditForm(patient) {
    const modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Edit Patient</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div id="formError" class="alert alert-danger d-none"></div>
        <form id="editPatientForm">
          <input type="hidden" id="patientID" value="${patient.patientID}">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="first_name" class="form-label">First Name</label>
              <input type="text" class="form-control" id="first_name" value="${
                patient.first_name
              }" required>
            </div>
            <div class="col-md-6 mb-3">
              <label for="last_name" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="last_name" value="${
                patient.last_name
              }" required>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="age" class="form-label">Age</label>
              <input type="number" class="form-control" id="age" value="${
                patient.age
              }" required min="0" max="150">
            </div>
            <div class="col-md-6 mb-3">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-control" id="gender" required>
                <option value="Male" ${
                  patient.gender === "Male" ? "selected" : ""
                }>Male</option>
                <option value="Female" ${
                  patient.gender === "Female" ? "selected" : ""
                }>Female</option>
                <option value="Other" ${
                  patient.gender === "Other" ? "selected" : ""
                }>Other</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="contact" class="form-label">Contact Number</label>
              <input type="tel" class="form-control" id="contact" value="${
                patient.contact_no
              }" required pattern="[0-9\\-+()]{10,}" title="Please enter at least 10 digits, can include +, -, ()">
            </div>
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" value="${
                patient.email
              }" required>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="emergencyContact" class="form-label">Emergency Contact</label>
              <input type="tel" class="form-control" id="emergencyContact" value="${
                patient.emergency_contact
              }" required pattern="[0-9\\-+()]{10,}" title="Please enter at least 10 digits, can include +, -, ()">
            </div>
            <div class="col-md-6 mb-3">
              <label for="address" class="form-label">Address</label>
              <textarea class="form-control" id="address" rows="3">${
                patient.address || ""
              }</textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="medicalHistory" class="form-label">Medical History</label>
              <textarea class="form-control" id="medicalHistory" rows="3" required>${
                patient.medical_history || ""
              }</textarea>
            </div>
            <div class="col-md-6 mb-3">
              <label for="insuranceDetails" class="form-label">Insurance Details</label>
              <textarea class="form-control" id="insuranceDetails" rows="3" required>${
                patient.insurance_details || ""
              }</textarea>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="patientForm.handleEdit()">
          <i class="fas fa-save"></i> Save Changes
        </button>
      </div>
    `;

    document.querySelector("#formModal .modal-content").innerHTML =
      modalContent;
    new bootstrap.Modal(document.getElementById("formModal")).show();
  },

  async handleEdit() {
    try {
      showLoading();
      const patientID = document.getElementById("patientID").value;
      const formData = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        age: parseInt(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        contact_no: document.getElementById("contact").value,
        email: document.getElementById("email").value,
        emergency_contact: document.getElementById("emergencyContact").value,
        medical_history: document.getElementById("medicalHistory").value,
        insurance_details: document.getElementById("insuranceDetails").value,
        address: document.getElementById("address").value || "",
      };

      // Validate form data
      if (!formData.first_name || !formData.last_name) {
        throw new Error("First name and last name are required");
      }

      if (isNaN(formData.age) || formData.age < 0 || formData.age > 150) {
        throw new Error("Age must be a valid number between 0 and 150");
      }

      await api.put(`patients/${patientID}`, formData);
      bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
      showSuccess("Patient updated successfully");
      await pageHandlers.patients();
    } catch (error) {
      console.error("Error updating patient:", error);
      document.getElementById("formError").textContent =
        error.message || "Failed to update patient";
      document.getElementById("formError").classList.remove("d-none");
    }
  },
};

// Doctor form handlers
const doctorForm = {
  // Common specializations and departments
  specializations: [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "General Surgery",
    "Gynecology",
    "Hematology",
    "Neurology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Otolaryngology",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Urology",
  ],

  departments: [
    "Emergency",
    "Intensive Care",
    "Outpatient",
    "Inpatient",
    "Surgery",
    "Pediatrics",
    "Obstetrics",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Oncology",
    "Radiology",
    "Laboratory",
    "Pharmacy",
  ],

  educationLevels: [
    "Bachelor's Degree",
    "Master's Degree",
    "Doctoral Degree (PhD)",
    "Doctor of Medicine (MD)",
    "Medical Specialty Board Certification",
    "Fellowship Training",
    "Post-Doctoral Training",
    "Other",
  ],

  showAddForm() {
    const modal = new bootstrap.Modal(document.getElementById("formModal"));
    document.querySelector(".modal-title").textContent = "Add New Doctor";
    document.querySelector(".modal-body").innerHTML = `
      <div id="formError" class="alert alert-danger d-none"></div>
      <div id="formLoading" class="text-center d-none">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Processing your request...</p>
      </div>
      <form id="addDoctorForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="first_name" class="form-label">First Name</label>
            <input type="text" class="form-control" id="first_name" required>
          </div>
          <div class="col-md-6 mb-3">
            <label for="last_name" class="form-label">Last Name</label>
            <input type="text" class="form-control" id="last_name" required>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="specialization" class="form-label">Specialization</label>
            <select class="form-select" id="specialization" required>
              <option value="">Select Specialization</option>
              ${this.specializations
                .map((spec) => `<option value="${spec}">${spec}</option>`)
                .join("")}
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label for="department" class="form-label">Department</label>
            <select class="form-select" id="department" required>
              <option value="">Select Department</option>
              ${this.departments
                .map((dept) => `<option value="${dept}">${dept}</option>`)
                .join("")}
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="phone_no" class="form-label">Phone Number</label>
            <input type="tel" class="form-control" id="phone_no" required pattern="[0-9\\-+()]{10,}" title="Please enter at least 10 digits">
          </div>
          <div class="col-md-6 mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" required>
          </div>
        </div>
        
        <div class="mb-3">
          <h5 class="border-bottom pb-2">Qualifications</h5>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="education_level" class="form-label">Highest Education Level</label>
              <select class="form-select" id="education_level">
                <option value="">Select Education Level</option>
                ${this.educationLevels
                  .map((level) => `<option value="${level}">${level}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="graduation_year" class="form-label">Graduation Year</label>
              <input type="number" class="form-control" id="graduation_year" min="1950" max="${new Date().getFullYear()}" placeholder="YYYY">
            </div>
          </div>
          
          <div class="mb-3">
            <label for="certificates" class="form-label">Certificates/Degrees</label>
            <div class="certificate-list" id="certificate-list">
              <div class="certificate-item d-flex mb-2">
                <input type="text" class="form-control me-2" placeholder="Certificate/Degree Name">
                <input type="text" class="form-control" placeholder="Issuing Institution">
                <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="this.parentNode.remove()">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary mt-2" onclick="doctorForm.addCertificateField()">
              <i class="fas fa-plus"></i> Add Certificate
            </button>
          </div>
          
          <div class="mb-3">
            <label for="qualifications" class="form-label">Additional Qualifications</label>
            <textarea class="form-control" id="qualifications" rows="3" placeholder="Other qualifications, experience, or specialized training..."></textarea>
          </div>
        </div>
        
        <div class="text-end mt-3">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="submitDoctorBtn" onclick="doctorForm.handleAdd()">
            <i class="fas fa-save"></i> Add Doctor
          </button>
        </div>
      </form>
    `;
    modal.show();
  },

  showEditForm(doctor) {
    // Parse stored qualifications data if available
    let educationLevel = "";
    let graduationYear = "";
    let certificates = [];
    let additionalQualifications = "";

    try {
      // Check if qualifications contains structured JSON data
      if (doctor.qualifications && doctor.qualifications.startsWith("{")) {
        const qualData = JSON.parse(doctor.qualifications);
        educationLevel = qualData.education_level || "";
        graduationYear = qualData.graduation_year || "";
        certificates = qualData.certificates || [];
        additionalQualifications = qualData.additional || "";
      } else {
        // If it's just a string, treat it as additional qualifications
        additionalQualifications = doctor.qualifications || "";
      }
    } catch (e) {
      console.error("Error parsing qualifications:", e);
      additionalQualifications = doctor.qualifications || "";
    }

    const modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Edit Doctor</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div id="formError" class="alert alert-danger d-none"></div>
        <form id="editDoctorForm">
          <input type="hidden" id="doctorID" value="${doctor.doctorID}">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="first_name" class="form-label">First Name</label>
              <input type="text" class="form-control" id="first_name" value="${
                doctor.first_name
              }" required>
            </div>
            <div class="col-md-6 mb-3">
              <label for="last_name" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="last_name" value="${
                doctor.last_name
              }" required>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="specialization" class="form-label">Specialization</label>
              <select class="form-select" id="specialization" required>
                <option value="">Select Specialization</option>
                ${doctorForm.specializations
                  .map(
                    (spec) =>
                      `<option value="${spec}" ${
                        doctor.specialization === spec ? "selected" : ""
                      }>${spec}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="department" class="form-label">Department</label>
              <select class="form-select" id="department" required>
                <option value="">Select Department</option>
                ${doctorForm.departments
                  .map(
                    (dept) =>
                      `<option value="${dept}" ${
                        doctor.department === dept ? "selected" : ""
                      }>${dept}</option>`
                  )
                  .join("")}
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="phone_no" class="form-label">Phone Number</label>
              <input type="tel" class="form-control" id="phone_no" value="${
                doctor.phone_no
              }" required pattern="[0-9\\-+()]{10,}" title="Please enter at least 10 digits">
            </div>
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" value="${
                doctor.email
              }" required>
            </div>
          </div>
          
          <div class="mb-3">
            <h5 class="border-bottom pb-2">Qualifications</h5>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="education_level" class="form-label">Highest Education Level</label>
                <select class="form-select" id="education_level">
                  <option value="">Select Education Level</option>
                  ${doctorForm.educationLevels
                    .map(
                      (level) =>
                        `<option value="${level}" ${
                          educationLevel === level ? "selected" : ""
                        }>${level}</option>`
                    )
                    .join("")}
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="graduation_year" class="form-label">Graduation Year</label>
                <input type="number" class="form-control" id="graduation_year" min="1950" max="${new Date().getFullYear()}" 
                       placeholder="YYYY" value="${graduationYear}">
              </div>
            </div>
            
            <div class="mb-3">
              <label for="certificates" class="form-label">Certificates/Degrees</label>
              <div class="certificate-list" id="certificate-list">
                ${
                  certificates.length > 0
                    ? certificates
                        .map(
                          (cert) => `
                    <div class="certificate-item d-flex mb-2">
                      <input type="text" class="form-control me-2" placeholder="Certificate/Degree Name" value="${
                        cert.name || ""
                      }">
                      <input type="text" class="form-control" placeholder="Issuing Institution" value="${
                        cert.institution || ""
                      }">
                      <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="this.parentNode.remove()">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  `
                        )
                        .join("")
                    : `<div class="certificate-item d-flex mb-2">
                    <input type="text" class="form-control me-2" placeholder="Certificate/Degree Name">
                    <input type="text" class="form-control" placeholder="Issuing Institution">
                    <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="this.parentNode.remove()">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>`
                }
              </div>
              <button type="button" class="btn btn-sm btn-outline-secondary mt-2" onclick="doctorForm.addCertificateField()">
                <i class="fas fa-plus"></i> Add Certificate
              </button>
            </div>
            
            <div class="mb-3">
              <label for="qualifications" class="form-label">Additional Qualifications</label>
              <textarea class="form-control" id="qualifications" rows="3" 
                placeholder="Other qualifications, experience, or specialized training...">${additionalQualifications}</textarea>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="status" class="form-label">Status</label>
              <select class="form-select" id="status" required>
                <option value="Active" ${
                  doctor.status === "Active" ? "selected" : ""
                }>Active</option>
                <option value="Inactive" ${
                  doctor.status === "Inactive" ? "selected" : ""
                }>Inactive</option>
                <option value="On Leave" ${
                  doctor.status === "On Leave" ? "selected" : ""
                }>On Leave</option>
              </select>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="doctorForm.handleEdit()">
          <i class="fas fa-save"></i> Save Changes
        </button>
      </div>
    `;

    document.querySelector("#formModal .modal-content").innerHTML =
      modalContent;
    new bootstrap.Modal(document.getElementById("formModal")).show();
  },

  addCertificateField() {
    const certificateList = document.getElementById("certificate-list");
    const newItem = document.createElement("div");
    newItem.className = "certificate-item d-flex mb-2";
    newItem.innerHTML = `
      <input type="text" class="form-control me-2" placeholder="Certificate/Degree Name">
      <input type="text" class="form-control" placeholder="Issuing Institution">
      <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="this.parentNode.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    certificateList.appendChild(newItem);
  },

  async handleAdd() {
    // Reference key elements
    const submitBtn = document.getElementById("submitDoctorBtn");
    const formLoading = document.getElementById("formLoading");
    const errorEl = document.getElementById("formError");

    // Prevent multiple submissions
    if (submitBtn.disabled) return;

    try {
      // Show loading and disable submit button
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
      if (formLoading) formLoading.classList.remove("d-none");
      if (errorEl) errorEl.classList.add("d-none");

      // Get basic form data
      const formData = {
        first_name: document.getElementById("first_name").value.trim(),
        last_name: document.getElementById("last_name").value.trim(),
        specialization: document.getElementById("specialization").value.trim(),
        department: document.getElementById("department").value.trim(),
        phone_no: document.getElementById("phone_no").value.trim(),
        email: document.getElementById("email").value.trim(),
      };

      // Gather qualifications data
      const educationLevel = document.getElementById("education_level").value;
      const graduationYear = document.getElementById("graduation_year").value;
      const certificates = [];

      // Collect all certificate items
      document.querySelectorAll(".certificate-item").forEach((item) => {
        const inputs = item.querySelectorAll("input");
        if (inputs[0].value.trim()) {
          certificates.push({
            name: inputs[0].value.trim(),
            institution: inputs[1].value.trim(),
          });
        }
      });

      // Additional qualifications text
      const additionalQualifications = document
        .getElementById("qualifications")
        .value.trim();

      // Create structured qualifications JSON
      const qualificationsData = {
        education_level: educationLevel,
        graduation_year: graduationYear,
        certificates: certificates,
        additional: additionalQualifications,
      };

      // Set qualifications as JSON string
      formData.qualifications = JSON.stringify(qualificationsData);

      // Quick validation
      const validationErrors = [];
      if (!formData.first_name) validationErrors.push("First name is required");
      if (!formData.last_name) validationErrors.push("Last name is required");
      if (!formData.specialization)
        validationErrors.push("Specialization is required");
      if (!formData.department) validationErrors.push("Department is required");
      if (!formData.phone_no) validationErrors.push("Phone number is required");
      if (!formData.email) validationErrors.push("Email is required");

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        validationErrors.push("Please enter a valid email address");
      }

      // Phone validation
      const phoneRegex = /^[\d\s\-+()]{10,}$/;
      if (formData.phone_no && !phoneRegex.test(formData.phone_no)) {
        validationErrors.push("Phone number must have at least 10 digits");
      }

      // Show validation errors if any
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("<br>"));
      }

      // Process form submission with optimistic UI update
      const processingMessage = document.createElement("div");
      processingMessage.className =
        "toast align-items-center text-white bg-primary border-0 position-fixed top-0 end-0 m-3";
      processingMessage.setAttribute("role", "alert");
      processingMessage.setAttribute("aria-live", "assertive");
      processingMessage.setAttribute("aria-atomic", "true");
      processingMessage.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Adding doctor...
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;
      document.body.appendChild(processingMessage);
      new bootstrap.Toast(processingMessage).show();

      // Submit to API
      const response = await api.post("doctors", formData);

      // Close modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("formModal")
      );
      if (modal) modal.hide();

      // Remove processing message
      if (processingMessage.parentNode) {
        processingMessage.parentNode.removeChild(processingMessage);
      }

      // Show success message
      showSuccess("Doctor added successfully");

      // Refresh doctors list
      pageHandlers.doctors();
    } catch (error) {
      console.error("Error adding doctor:", error);

      // Re-enable form
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Doctor';
      }
      if (formLoading) formLoading.classList.add("d-none");

      // Show error message
      if (errorEl) {
        errorEl.innerHTML =
          error.message || "Failed to add doctor. Please try again.";
        errorEl.classList.remove("d-none");
      }
    }
  },

  async handleEdit() {
    try {
      showLoading();
      const doctorID = document.getElementById("doctorID").value;

      // Get basic form data
      const formData = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        specialization: document.getElementById("specialization").value,
        department: document.getElementById("department").value,
        phone_no: document.getElementById("phone_no").value,
        email: document.getElementById("email").value,
        status: document.getElementById("status").value,
      };

      // Gather qualifications data
      const educationLevel = document.getElementById("education_level").value;
      const graduationYear = document.getElementById("graduation_year").value;
      const certificates = [];

      // Collect all certificate items
      document.querySelectorAll(".certificate-item").forEach((item) => {
        const inputs = item.querySelectorAll("input");
        if (inputs[0].value.trim()) {
          certificates.push({
            name: inputs[0].value.trim(),
            institution: inputs[1].value.trim(),
          });
        }
      });

      // Additional qualifications text
      const additionalQualifications = document
        .getElementById("qualifications")
        .value.trim();

      // Create structured qualifications JSON
      const qualificationsData = {
        education_level: educationLevel,
        graduation_year: graduationYear,
        certificates: certificates,
        additional: additionalQualifications,
      };

      // Set qualifications as JSON string
      formData.qualifications = JSON.stringify(qualificationsData);

      // Validate form data
      if (!formData.first_name || !formData.last_name) {
        throw new Error("First name and last name are required");
      }

      await api.put(`doctors/${doctorID}`, formData);
      bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
      showSuccess("Doctor updated successfully");
      await pageHandlers.doctors();
    } catch (error) {
      console.error("Error updating doctor:", error);
      document.getElementById("formError").textContent =
        error.message || "Failed to update doctor";
      document.getElementById("formError").classList.remove("d-none");
    }
  },

  confirmDelete(doctorID) {
    if (
      confirm(
        "Are you sure you want to delete this doctor? This action cannot be undone."
      )
    ) {
      this.handleDelete(doctorID);
    }
  },

  async handleDelete(doctorID) {
    try {
      showLoading();
      await api.delete(`doctors/${doctorID}`);
      showSuccess("Doctor deleted successfully");
      await pageHandlers.doctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      showError(error.message || "Failed to delete doctor");
    }
  },

  showViewDetails(doctor) {
    // Parse qualifications data if available
    let qualificationsData = {
      education_level: "",
      graduation_year: "",
      certificates: [],
      additional: "",
    };

    try {
      if (doctor.qualifications && doctor.qualifications.startsWith("{")) {
        qualificationsData = JSON.parse(doctor.qualifications);
      } else if (doctor.qualifications) {
        qualificationsData.additional = doctor.qualifications;
      }
    } catch (e) {
      console.error("Error parsing qualifications:", e);
      qualificationsData.additional = doctor.qualifications || "";
    }

    // Generate certificates HTML if available
    let certificatesHtml = "";
    if (
      qualificationsData.certificates &&
      qualificationsData.certificates.length > 0
    ) {
      certificatesHtml = `
        <div class="mt-3">
          <strong>Certificates/Degrees:</strong>
          <ul class="list-group">
            ${qualificationsData.certificates
              .map(
                (cert) => `
              <li class="list-group-item">
                <div><strong>${cert.name || "Not specified"}</strong></div>
                ${
                  cert.institution
                    ? `<div class="text-muted">Institution: ${cert.institution}</div>`
                    : ""
                }
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
    }

    const modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Doctor Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Personal Information</h6>
            <p><strong>Name:</strong> ${doctor.first_name} ${
      doctor.last_name
    }</p>
            <p><strong>Specialization:</strong> ${doctor.specialization}</p>
            <p><strong>Department:</strong> ${doctor.department}</p>
          </div>
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Contact Information</h6>
            <p><strong>Phone:</strong> ${doctor.phone_no}</p>
            <p><strong>Email:</strong> ${doctor.email}</p>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12">
            <h6 class="text-primary mb-3">Professional Information</h6>
            <div class="card mb-3">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <p><strong>Education Level:</strong> ${
                      qualificationsData.education_level || "Not specified"
                    }</p>
                  </div>
                  <div class="col-md-6">
                    <p><strong>Graduation Year:</strong> ${
                      qualificationsData.graduation_year || "Not specified"
                    }</p>
                  </div>
                </div>
                ${certificatesHtml}
                ${
                  qualificationsData.additional
                    ? `
                  <div class="mt-3">
                    <strong>Additional Qualifications:</strong>
                    <p class="mt-2">${qualificationsData.additional}</p>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
            <p><strong>Status:</strong> <span class="badge ${
              doctor.status === "Active" ? "bg-success" : "bg-danger"
            }">${doctor.status || "Active"}</span></p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick='doctorForm.showEditForm(${JSON.stringify(
          doctor
        ).replace(/'/g, "\\'")})'>
          <i class="fas fa-edit"></i> Edit Doctor
        </button>
      </div>
    `;

    document.querySelector("#formModal .modal-content").innerHTML =
      modalContent;
    new bootstrap.Modal(document.getElementById("formModal")).show();
  },
};

// Consultation form handlers
const consultationForm = {
  async showAddForm() {
    try {
      // Fetch patients and doctors for the form
      const patients = await api.get("patients");
      const doctors = await api.get("doctors");

      const modal = new bootstrap.Modal(document.getElementById("formModal"));
      document.querySelector(".modal-title").textContent =
        "Add New Consultation";
      document.querySelector(".modal-body").innerHTML = `
        <div id="formError" class="alert alert-danger d-none"></div>
        <div id="formLoading" class="text-center d-none">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Processing your request...</p>
        </div>
        <form id="addConsultationForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="patientSelect" class="form-label">Select Patient</label>
              <select class="form-select" id="patientSelect" required>
                <option value="">Select Patient</option>
                ${patients
                  .map(
                    (patient) =>
                      `<option value="${patient.patientID}">${patient.first_name} ${patient.last_name}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div class="col-md-6">
              <label for="doctorSelect" class="form-label">Select Doctor</label>
              <select class="form-select" id="doctorSelect" required>
                <option value="">Select Doctor</option>
                ${doctors
                  .map(
                    (doctor) =>
                      `<option value="${doctor.doctorID}">${doctor.first_name} ${doctor.last_name} (${doctor.specialization})</option>`
                  )
                  .join("")}
              </select>
            </div>
          </div>
          
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="consultationDate" class="form-label">Consultation Date</label>
              <input type="date" class="form-control" id="consultationDate" required min="${
                new Date().toISOString().split("T")[0]
              }">
            </div>
            <div class="col-md-6">
              <label for="consultationTime" class="form-label">Consultation Time</label>
              <input type="time" class="form-control" id="consultationTime" required>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="consultationType" class="form-label">Consultation Type</label>
            <select class="form-select" id="consultationType" required>
              <option value="">Select Type</option>
              <option value="Initial">Initial Consultation</option>
              <option value="Follow-up">Follow-up Consultation</option>
              <option value="Emergency">Emergency Consultation</option>
              <option value="Specialist">Specialist Consultation</option>
            </select>
          </div>
          
          <div class="mb-3">
            <label for="consultationReason" class="form-label">Reason for Consultation</label>
            <textarea class="form-control" id="consultationReason" rows="3" required></textarea>
          </div>
          
          <div class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="needsTestsCheck">
              <label class="form-check-label" for="needsTestsCheck">
                Requires medical tests
              </label>
            </div>
          </div>
          
          <div class="text-end mt-3">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="submitConsultationBtn" onclick="consultationForm.handleAdd()">
              <i class="fas fa-save"></i> Create Consultation
            </button>
          </div>
        </form>
      `;
      modal.show();
    } catch (error) {
      console.error("Error preparing consultation form:", error);
      showError("Failed to load consultation form data");
    }
  },

  async handleAdd() {
    // Reference key elements
    const submitBtn = document.getElementById("submitConsultationBtn");
    const formLoading = document.getElementById("formLoading");
    const errorEl = document.getElementById("formError");

    // Prevent multiple submissions
    if (submitBtn && submitBtn.disabled) return;

    try {
      // Show loading and disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
      }
      if (formLoading) formLoading.classList.remove("d-none");
      if (errorEl) errorEl.classList.add("d-none");

      // Gather form data
      const patientID = document.getElementById("patientSelect").value;
      const doctorID = document.getElementById("doctorSelect").value;
      const consultationDate =
        document.getElementById("consultationDate").value;
      const consultationTime =
        document.getElementById("consultationTime").value;
      const consultationType =
        document.getElementById("consultationType").value;
      const consultationReason =
        document.getElementById("consultationReason").value;
      const needsTests = document.getElementById("needsTestsCheck").checked;

      // Validate form data
      if (
        !patientID ||
        !doctorID ||
        !consultationDate ||
        !consultationTime ||
        !consultationType ||
        !consultationReason
      ) {
        throw new Error("Please fill in all required fields");
      }

      // First create an appointment (this is automatic now)
      console.log("Creating appointment automatically for the consultation...");
      const appointmentData = {
        patientID: parseInt(patientID),
        doctorID: parseInt(doctorID),
        appDate: consultationDate,
        appTime: consultationTime,
        status: "Scheduled",
        notes: `Appointment for ${consultationType} consultation: ${consultationReason.substring(
          0,
          100
        )}${consultationReason.length > 100 ? "..." : ""}`,
      };

      // Submit appointment to API
      const appointmentResponse = await api.post(
        "appointments",
        appointmentData
      );
      console.log("Appointment created:", appointmentResponse);

      if (!appointmentResponse || !appointmentResponse.appID) {
        throw new Error("Failed to create appointment for the consultation");
      }

      // Now create the consultation using the new appointment ID
      const consultationData = {
        appointmentID: appointmentResponse.appID,
        consultationType: consultationType,
        reason: consultationReason,
        needsTests: needsTests,
        status: "Scheduled",
      };

      // Submit consultation to API
      const consultationResponse = await api.post(
        "consultations",
        consultationData
      );
      console.log("Consultation created:", consultationResponse);

      // Close modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("formModal")
      );
      if (modal) modal.hide();

      // Show success message
      showSuccess("Consultation scheduled successfully with an appointment");

      // Refresh consultations list
      await pageHandlers.consultations();
    } catch (error) {
      console.error("Error adding consultation:", error);

      // Re-enable form
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Create Consultation';
      }
      if (formLoading) formLoading.classList.add("d-none");

      // Show error message
      if (errorEl) {
        errorEl.innerHTML =
          error.message || "Failed to create consultation. Please try again.";
        errorEl.classList.remove("d-none");
      }
    }
  },

  showViewDetails(consultation) {
    const modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">Consultation Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Patient Information</h6>
            <p><strong>Name:</strong> ${consultation.patient_name} ${
      consultation.patient_last_name || ""
    }</p>
          </div>
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Doctor Information</h6>
            <p><strong>Name:</strong> ${consultation.doctor_name} ${
      consultation.doctor_last_name || ""
    }</p>
            <p><strong>Specialization:</strong> ${
              consultation.doctor_specialization || "Not specified"
            }</p>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Appointment Details</h6>
            <p><strong>Date:</strong> ${
              consultation.appDate || "Not specified"
            }</p>
            <p><strong>Time:</strong> ${
              consultation.appTime || "Not specified"
            }</p>
          </div>
          <div class="col-md-6">
            <h6 class="text-primary mb-3">Consultation Information</h6>
            <p><strong>Type:</strong> ${
              consultation.consultationType || "Not specified"
            }</p>
            <p><strong>Status:</strong> <span class="badge ${
              consultation.status === "Completed"
                ? "bg-success"
                : consultation.status === "Scheduled"
                ? "bg-primary"
                : consultation.status === "Cancelled"
                ? "bg-danger"
                : "bg-secondary"
            }">${consultation.status || "Not specified"}</span></p>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <h6 class="text-primary mb-3">Medical Details</h6>
            <p><strong>Reason:</strong> ${
              consultation.reason || "Not specified"
            }</p>
            <p><strong>Diagnosis:</strong> ${
              consultation.diagnosis || "Not yet provided"
            }</p>
            <p><strong>Prescription:</strong> ${
              consultation.prescription || "Not yet provided"
            }</p>
            <p><strong>Notes:</strong> ${
              consultation.notes || "No additional notes"
            }</p>
            <p><strong>Requires Tests:</strong> ${
              consultation.needsTests ? "Yes" : "No"
            }</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick='consultationForm.showEditForm(${JSON.stringify(
          consultation
        ).replace(/'/g, "\\'")})'>
          <i class="fas fa-edit"></i> Edit Consultation
        </button>
      </div>
    `;

    document.querySelector("#formModal .modal-content").innerHTML =
      modalContent;
    new bootstrap.Modal(document.getElementById("formModal")).show();
  },

  async showEditForm(consultation) {
    try {
      // Fetch patients and doctors for the form
      const patients = await api.get("patients");
      const doctors = await api.get("doctors");

      const modalContent = `
        <div class="modal-header">
          <h5 class="modal-title">Edit Consultation</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div id="formError" class="alert alert-danger d-none"></div>
          <form id="editConsultationForm">
            <input type="hidden" id="consultationID" value="${
              consultation.consultationID
            }">
            <input type="hidden" id="appointmentID" value="${
              consultation.appointmentID
            }">
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="patientSelect" class="form-label">Patient</label>
                <select class="form-select" id="patientSelect" disabled>
                  ${patients
                    .map(
                      (patient) =>
                        `<option value="${patient.patientID}" ${
                          patient.first_name + " " + patient.last_name ===
                          consultation.patient_name +
                            " " +
                            (consultation.patient_last_name || "")
                            ? "selected"
                            : ""
                        }>${patient.first_name} ${patient.last_name}</option>`
                    )
                    .join("")}
                </select>
                <small class="text-muted">Patient cannot be changed</small>
              </div>
              <div class="col-md-6">
                <label for="doctorSelect" class="form-label">Doctor</label>
                <select class="form-select" id="doctorSelect" disabled>
                  ${doctors
                    .map(
                      (doctor) =>
                        `<option value="${doctor.doctorID}" ${
                          doctor.first_name + " " + doctor.last_name ===
                          consultation.doctor_name +
                            " " +
                            (consultation.doctor_last_name || "")
                            ? "selected"
                            : ""
                        }>${doctor.first_name} ${doctor.last_name} (${
                          doctor.specialization
                        })</option>`
                    )
                    .join("")}
                </select>
                <small class="text-muted">Doctor cannot be changed</small>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="consultationDate" class="form-label">Consultation Date</label>
                <input type="date" class="form-control" id="consultationDate" value="${
                  consultation.appDate || ""
                }" required>
              </div>
              <div class="col-md-6">
                <label for="consultationTime" class="form-label">Consultation Time</label>
                <input type="time" class="form-control" id="consultationTime" value="${
                  consultation.appTime
                    ? consultation.appTime.substring(0, 5)
                    : ""
                }" required>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="consultationType" class="form-label">Consultation Type</label>
                <select class="form-select" id="consultationType" required>
                  <option value="">Select Type</option>
                  <option value="Initial" ${
                    consultation.consultationType === "Initial"
                      ? "selected"
                      : ""
                  }>Initial Consultation</option>
                  <option value="Follow-up" ${
                    consultation.consultationType === "Follow-up"
                      ? "selected"
                      : ""
                  }>Follow-up Consultation</option>
                  <option value="Emergency" ${
                    consultation.consultationType === "Emergency"
                      ? "selected"
                      : ""
                  }>Emergency Consultation</option>
                  <option value="Specialist" ${
                    consultation.consultationType === "Specialist"
                      ? "selected"
                      : ""
                  }>Specialist Consultation</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="status" class="form-label">Status</label>
                <select class="form-select" id="status" required>
                  <option value="Scheduled" ${
                    consultation.status === "Scheduled" ? "selected" : ""
                  }>Scheduled</option>
                  <option value="In Progress" ${
                    consultation.status === "In Progress" ? "selected" : ""
                  }>In Progress</option>
                  <option value="Completed" ${
                    consultation.status === "Completed" ? "selected" : ""
                  }>Completed</option>
                  <option value="Cancelled" ${
                    consultation.status === "Cancelled" ? "selected" : ""
                  }>Cancelled</option>
                </select>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="consultationReason" class="form-label">Reason for Consultation</label>
              <textarea class="form-control" id="consultationReason" rows="2" required>${
                consultation.reason || ""
              }</textarea>
            </div>
            
            <div class="mb-3">
              <label for="diagnosis" class="form-label">Diagnosis</label>
              <textarea class="form-control" id="diagnosis" rows="2">${
                consultation.diagnosis || ""
              }</textarea>
            </div>
            
            <div class="mb-3">
              <label for="prescription" class="form-label">Prescription</label>
              <textarea class="form-control" id="prescription" rows="2">${
                consultation.prescription || ""
              }</textarea>
            </div>
            
            <div class="mb-3">
              <label for="notes" class="form-label">Notes</label>
              <textarea class="form-control" id="notes" rows="2">${
                consultation.notes || ""
              }</textarea>
            </div>
            
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="needsTestsCheck" ${
                  consultation.needsTests ? "checked" : ""
                }>
                <label class="form-check-label" for="needsTestsCheck">
                  Requires medical tests
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" onclick="consultationForm.handleEdit()">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </div>
      `;

      document.querySelector("#formModal .modal-content").innerHTML =
        modalContent;
      new bootstrap.Modal(document.getElementById("formModal")).show();
    } catch (error) {
      console.error("Error preparing edit consultation form:", error);
      showError("Failed to load consultation edit form");
    }
  },

  async handleEdit() {
    try {
      showLoading();
      const consultationID = document.getElementById("consultationID").value;
      const appointmentID = document.getElementById("appointmentID").value;

      // Get consultation form data
      const consultationData = {
        consultationType: document.getElementById("consultationType").value,
        reason: document.getElementById("consultationReason").value,
        diagnosis: document.getElementById("diagnosis").value,
        prescription: document.getElementById("prescription").value,
        notes: document.getElementById("notes").value,
        needsTests: document.getElementById("needsTestsCheck").checked,
        status: document.getElementById("status").value,
      };

      // Get appointment form data (for updating date/time)
      const appointmentData = {
        appDate: document.getElementById("consultationDate").value,
        appTime: document.getElementById("consultationTime").value,
        status:
          document.getElementById("status").value === "Cancelled"
            ? "Cancelled"
            : document.getElementById("status").value === "Completed"
            ? "Completed"
            : "Scheduled",
      };

      // Update the appointment
      await api.put(`appointments/${appointmentID}`, appointmentData);

      // Update the consultation
      await api.put(`consultations/${consultationID}`, consultationData);

      // Close modal and refresh
      bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
      showSuccess("Consultation updated successfully");
      await pageHandlers.consultations();
    } catch (error) {
      console.error("Error updating consultation:", error);
      document.getElementById("formError").textContent =
        error.message || "Failed to update consultation";
      document.getElementById("formError").classList.remove("d-none");
    }
  },

  confirmDelete(consultationID) {
    if (
      confirm(
        "Are you sure you want to delete this consultation? This action cannot be undone."
      )
    ) {
      this.handleDelete(consultationID);
    }
  },

  async handleDelete(consultationID) {
    try {
      showLoading();
      await api.delete(`consultations/${consultationID}`);
      showSuccess("Consultation deleted successfully");
      await pageHandlers.consultations();
    } catch (error) {
      console.error("Error deleting consultation:", error);
      showError(error.message || "Failed to delete consultation");
    }
  },
};

// Booking form handlers
const bookingForm = {
  selectedDoctor: null,
  selectedTimeSlot: null,

  handlePatientSubmit(event) {
    event.preventDefault();
    // Store patient data in sessionStorage
    const patientData = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      age: document.getElementById("age").value,
      gender: document.getElementById("gender").value,
      consultation_type: document.getElementById("consultation_type").value,
      preferred_date: document.getElementById("preferred_date").value,
      symptoms: document.getElementById("symptoms").value,
    };
    sessionStorage.setItem("patientData", JSON.stringify(patientData));

    // Show doctor selection section
    document.getElementById("patientBookingForm").style.display = "none";
    document.getElementById("doctorSelection").style.display = "block";

    // Update step indicators
    document.querySelectorAll(".step-number")[0].classList.remove("active");
    document.querySelectorAll(".step-number")[1].classList.add("active");
    document.querySelectorAll(".step-title")[0].classList.remove("active");
    document.querySelectorAll(".step-title")[1].classList.add("active");
  },

  selectDoctor(doctorID) {
    this.selectedDoctor = doctorID;

    // Update UI to show selected doctor
    document.querySelectorAll(".doctor-card").forEach((card) => {
      card.classList.remove("selected");
    });
    event.currentTarget.closest(".doctor-card").classList.add("selected");

    // Show time selection section
    document.getElementById("doctorSelection").style.display = "none";
    document.getElementById("timeSelection").style.display = "block";

    // Update step indicators
    document.querySelectorAll(".step-number")[1].classList.remove("active");
    document.querySelectorAll(".step-number")[2].classList.add("active");
    document.querySelectorAll(".step-title")[1].classList.remove("active");
    document.querySelectorAll(".step-title")[2].classList.add("active");

    // Load available time slots
    this.loadTimeSlots(doctorID);
  },

  async loadTimeSlots(doctorID) {
    const timeSlotsContainer = document.getElementById("timeSlots");
    timeSlotsContainer.innerHTML =
      '<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>';

    try {
      const patientData = JSON.parse(sessionStorage.getItem("patientData"));
      const response = await api.post("appointments/available-slots", {
        doctorID: doctorID,
        date: patientData.preferred_date,
      });

      if (response.slots && response.slots.length > 0) {
        timeSlotsContainer.innerHTML = `
          <div class="row g-2">
            ${response.slots
              .map(
                (slot) => `
              <div class="col-md-3">
                <button class="btn btn-outline-primary w-100 time-slot" 
                        onclick="bookingForm.selectTimeSlot('${slot}')">
                  ${slot}
                </button>
              </div>
            `
              )
              .join("")}
          </div>
        `;
      } else {
        timeSlotsContainer.innerHTML = `
          <div class="alert alert-info">
            No available time slots for the selected date. Please choose another date.
          </div>
        `;
      }
    } catch (error) {
      console.error("Error loading time slots:", error);
      timeSlotsContainer.innerHTML = `
        <div class="alert alert-danger">
          Failed to load available time slots. Please try again.
        </div>
      `;
    }
  },

  selectTimeSlot(time) {
    this.selectedTimeSlot = time;

    // Update UI to show selected time slot
    document.querySelectorAll(".time-slot").forEach((slot) => {
      slot.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
  },

  showDoctorSelection() {
    document.getElementById("timeSelection").style.display = "none";
    document.getElementById("doctorSelection").style.display = "block";

    // Update step indicators
    document.querySelectorAll(".step-number")[2].classList.remove("active");
    document.querySelectorAll(".step-number")[1].classList.add("active");
    document.querySelectorAll(".step-title")[2].classList.remove("active");
    document.querySelectorAll(".step-title")[1].classList.add("active");
  },

  async confirmBooking() {
    if (!this.selectedTimeSlot) {
      showError("Please select a time slot");
      return;
    }

    try {
      showLoading();
      const patientData = JSON.parse(sessionStorage.getItem("patientData"));

      // Create appointment
      const appointmentData = {
        patientID: null, // Will be set after patient creation
        doctorID: this.selectedDoctor,
        appDate: patientData.preferred_date,
        appTime: this.selectedTimeSlot,
        status: "Scheduled",
        notes: `Appointment for ${
          patientData.consultation_type
        } consultation: ${patientData.symptoms.substring(0, 100)}${
          patientData.symptoms.length > 100 ? "..." : ""
        }`,
      };

      // Create patient first
      const patientResponse = await api.post("patients", {
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        email: patientData.email,
        contact_no: patientData.phone,
        age: parseInt(patientData.age),
        gender: patientData.gender,
      });

      // Set patient ID in appointment data
      appointmentData.patientID = patientResponse.patientID;

      // Create appointment
      const appointmentResponse = await api.post(
        "appointments",
        appointmentData
      );

      // Create consultation
      const consultationData = {
        appointmentID: appointmentResponse.appID,
        consultationType: patientData.consultation_type,
        reason: patientData.symptoms,
        status: "Scheduled",
      };

      await api.post("consultations", consultationData);

      showSuccess("Consultation booked successfully!");

      // Clear session storage
      sessionStorage.removeItem("patientData");

      // Redirect to consultations page
      window.location.hash = "#consultations";
    } catch (error) {
      console.error("Error booking consultation:", error);
      showError(error.message || "Failed to book consultation");
    }
  },
};

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing application...");

  // Initialize navigation bar
  showNavBar();

  // Setup event listeners for hash changes
  window.addEventListener("hashchange", () => {
    console.log("Hash changed to:", window.location.hash);
    routeBasedOnHash();

    // Update active nav link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });

    const currentHash = window.location.hash.replace("#", "") || "home";
    const activeLink = document.querySelector(
      `.nav-link[href="#${currentHash}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  });

  // Initial routing based on URL hash
  routeBasedOnHash();

  // Setup global modal for forms
  const modalHtml = `
    <div class="modal fade" id="formModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Content will be dynamically inserted -->
        </div>
      </div>
    </div>
  `;

  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer.firstElementChild);
});

async function showPage(page) {
  showLoading();
  try {
    console.log("Showing page:", page);

    switch (page) {
      case "home":
        await pageHandlers.home();
        break;
      case "patients":
        await pageHandlers.patients();
        break;
      case "doctors":
        await pageHandlers.doctors();
        break;
      case "appointments":
        await pageHandlers.appointments();
        break;
      case "consultations":
        await pageHandlers.consultations();
        break;
      case "book-consultation":
        await pageHandlers.bookConsultation();
        break;
      default:
        await pageHandlers.home();
        break;
    }

    hideLoading();
  } catch (error) {
    console.error("Error showing page:", error);
    showError("Failed to load page");
  }
}

function showNavBar() {
  const navbarHtml = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#home">
          <i class="fas fa-hospital-alt me-2"></i>Hospital Consultation
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#home">
                <i class="fas fa-home"></i> Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#patients">
                <i class="fas fa-user-injured"></i> Patients
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#doctors">
                <i class="fas fa-user-md"></i> Doctors
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#appointments">
                <i class="fas fa-calendar-check"></i> Appointments
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#consultations">
                <i class="fas fa-comments-medical"></i> Consultations
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#book-consultation">
                <i class="fas fa-plus-circle"></i> Book Consultation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;

  document.getElementById("navbar").innerHTML = navbarHtml;

  // Update active link based on current hash
  const currentHash = window.location.hash.replace("#", "") || "home";
  const activeLink = document.querySelector(
    `.nav-link[href="#${currentHash}"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Route based on URL hash when page loads
function routeBasedOnHash() {
  const hash = window.location.hash.replace("#", "");
  console.log("Current hash:", hash);
  if (hash) {
    showPage(hash);
  } else {
    showPage("home");
  }
}

// Function to load quick stats for the home page
function loadQuickStats() {
  // Load doctors count
  fetch("http://localhost:5001/api/doctors/count")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("stat-doctors").textContent = data.count;
    })
    .catch((error) => console.error("Error loading doctor stats:", error));

  // Load patients count
  fetch("http://localhost:5001/api/patients/count")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("stat-patients").textContent = data.count;
    })
    .catch((error) => console.error("Error loading patient stats:", error));

  // Load appointments count
  fetch("http://localhost:5001/api/appointments/count")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("stat-appointments").textContent = data.count;
    })
    .catch((error) => console.error("Error loading appointment stats:", error));

  // Load consultations count
  fetch("http://localhost:5001/api/consultations/count")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("stat-consultations").textContent = data.count;
    })
    .catch((error) =>
      console.error("Error loading consultation stats:", error)
    );
}

// Function to load recent notifications
function loadRecentNotifications() {
  fetch("http://localhost:5001/api/notifications/recent")
    .then((response) => response.json())
    .then((data) => {
      const notificationsContainer = document.getElementById(
        "recent-notifications"
      );

      if (data.length === 0) {
        notificationsContainer.innerHTML =
          '<p class="text-center text-muted">No recent notifications</p>';
        return;
      }

      const notificationsList = document.createElement("ul");
      notificationsList.className = "list-group list-group-flush";

      data.forEach((notification) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item px-0";
        listItem.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <i class="fas ${getNotificationIcon(
                notification.type
              )} text-${getNotificationColor(notification.type)} me-2"></i>
              ${notification.message}
            </div>
            <small class="text-muted">${formatTimeAgo(
              new Date(notification.timestamp)
            )}</small>
          </div>
        `;
        notificationsList.appendChild(listItem);
      });

      notificationsContainer.innerHTML = "";
      notificationsContainer.appendChild(notificationsList);
    })
    .catch((error) => {
      console.error("Error loading recent notifications:", error);
      document.getElementById("recent-notifications").innerHTML =
        '<p class="text-center text-danger">Failed to load notifications</p>';
    });
}

// Helper function to get notification icon
function getNotificationIcon(type) {
  switch (type) {
    case "appointment":
      return "fa-calendar-check";
    case "consultation":
      return "fa-stethoscope";
    case "patient":
      return "fa-user";
    case "doctor":
      return "fa-user-md";
    default:
      return "fa-bell";
  }
}

// Helper function to get notification color
function getNotificationColor(type) {
  switch (type) {
    case "appointment":
      return "primary";
    case "consultation":
      return "success";
    case "patient":
      return "info";
    case "doctor":
      return "warning";
    default:
      return "secondary";
  }
}

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
}
