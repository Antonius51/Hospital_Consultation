cmake_minimum_required(VERSION 3.10)
project(HospitalConsultationSystem)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set MySQL paths - adjust these paths according to your MySQL installation
set(MYSQL_DIR "C:/Program Files/MySQL/MySQL Server 8.0")
set(MYSQL_INCLUDE_DIRS "${MYSQL_DIR}/include")
set(MYSQL_LIBRARY_DIRS "${MYSQL_DIR}/lib")

# Include directories
include_directories(
    ${CMAKE_SOURCE_DIR}/include
    ${MYSQL_INCLUDE_DIRS}
)

# Link directories
link_directories(${MYSQL_LIBRARY_DIRS})

# Add source files
set(SOURCES
    src/main.cpp
    src/db_connection.cpp
)

# Create main executable
add_executable(hospital_server ${SOURCES})

# Link libraries for main executable
target_link_libraries(hospital_server
    PRIVATE
    libmysql
) 