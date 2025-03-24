# Device Inventory Alert Tracker - Kotlin Backend

This is the Kotlin/Spring Boot implementation of the Device Inventory Alert Tracker backend.

## Features

- RESTful API for managing devices, alerts, and audit logs
- Spring Data JPA for database access
- PostgreSQL database integration 
- Exception handling with meaningful error responses
- API compatibility with the Express.js backend

## API Endpoints

### Devices
- `GET /api/devices` - Get all devices
- `GET /api/devices/{id}` - Get a device by ID
- `POST /api/devices` - Create a new device
- `PUT /api/devices/{id}` - Update a device
- `DELETE /api/devices/{id}` - Delete a device

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/{id}` - Get an alert by ID
- `GET /api/alerts/device/{deviceId}` - Get alerts for a specific device
- `POST /api/alerts` - Create a new alert
- `PUT /api/alerts/{id}` - Update an alert
- `DELETE /api/alerts/{id}` - Delete an alert

### Audit Logs
- `GET /api/audit-logs` - Get all audit logs

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Users
- `GET /api/users/{id}` - Get a user by ID
- `GET /api/users/username/{username}` - Get a user by username
- `POST /api/users` - Create a new user

## Running the Application

### Prerequisites
- JDK 17 or higher
- PostgreSQL database (connection string provided by environment variable `DATABASE_URL`)

### Steps to Run
1. Ensure environment variables are set:
   - `DATABASE_URL` - PostgreSQL connection string

2. Navigate to the `backend-kotlin` directory:
   ```
   cd backend-kotlin
   ```

3. Build the application using Gradle:
   ```
   ./gradlew build
   ```

4. Run the application:
   ```
   ./gradlew bootRun
   ```

The application will start on port 8080 by default.

## Testing the API

You can use tools like Postman or cURL to test the API endpoints.

Example cURL command to get all devices:
```
curl -X GET http://localhost:8080/api/devices
```

Example cURL command to create a new device:
```
curl -X POST http://localhost:8080/api/devices \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Device","os":"Windows 11","status":"online","location":"Office"}'
```