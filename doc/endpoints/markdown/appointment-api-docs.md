---

# Appointment API Documentation

### Base URL
`/api/appointments`

---

### Create Appointment

- **URL**: `/api/appointments`
- **Method**: `POST`
- **Description**: Creates a new appointment.
- **Request Parameters**:
  - `doctorUsername` (String): Username of the doctor.
  - `patientId` (Long): ID of the patient.
  - `appointmentDate` (ISO 8601 DateTime): Date and time of the appointment.
  - `location` (String): Location of the appointment.
- **Response**: `201 Created`
  ```json
  {
    "id": "Long",
    "patientId": "Long",
    "doctorId": "Long",
    "appointmentDate": "ISO 8601 DateTime",
    "location": "String",
    "status": "String",
    "createdAt": "ISO 8601 DateTime"
  }
  ```
- **Note**: `appointmentDate` must be in ISO 8601 format (`YYYY-MM-DDTHH:MM:SS`).

---

### Get Appointments by Doctor

- **URL**: `/api/appointments/doctor/{doctorId}`
- **Method**: `GET`
- **Description**: Retrieves all appointments for a specific doctor.
- **Path Parameter**:
  - `doctorId` (Long): ID of the doctor.
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "Long",
      "patientId": "Long",
      "doctorId": "Long",
      "appointmentDate": "ISO 8601 DateTime",
      "location": "String",
      "status": "String",
      "createdAt": "ISO 8601 DateTime"
    }
  ]
  ```

---

### Get Appointments by Patient

- **URL**: `/api/appointments/patient/{patientId}`
- **Method**: `GET`
- **Description**: Retrieves all appointments for a specific patient.
- **Path Parameter**:
  - `patientId` (Long): ID of the patient.
- **Response**: `200 OK`

---

### Get Appointments by Location

- **URL**: `/api/appointments/location`
- **Method**: `GET`
- **Description**: Retrieves all appointments at a specific location.
- **Query Parameter**:
  - `location` (String): Location of the appointment.
- **Response**: `200 OK`

---

### Get Appointments by Status

- **URL**: `/api/appointments/status`
- **Method**: `GET`
- **Description**: Retrieves all appointments with a specific status.
- **Query Parameter**:
  - `status` (String): Status of the appointments (e.g., "active", "canceled").
- **Response**: `200 OK`

---

### Delete Appointment

- **URL**: `/api/appointments/{appointmentId}`
- **Method**: `DELETE`
- **Description**: Deletes an appointment by ID.
- **Path Parameter**:
  - `appointmentId` (Long): ID of the appointment.
- **Response**: `204 No Content`

---

### Update Appointment Status

- **URL**: `/api/appointments/{appointmentId}/status`
- **Method**: `PUT`
- **Description**: Updates the status of an appointment.
- **Path Parameter**:
  - `appointmentId` (Long): ID of the appointment.
- **Request Parameter**:
  - `status` (String): New status of the appointment.
- **Response**: `200 OK`
  ```json
  {
    "id": "Long",
    "patientId": "Long",
    "doctorId": "Long",
    "appointmentDate": "ISO 8601 DateTime",
    "location": "String",
    "status": "String",
    "createdAt": "ISO 8601 DateTime"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid status provided.

---

### Get Appointments by Date Range

- **URL**: `/api/appointments/date-range`
- **Method**: `GET`
- **Description**: Retrieves appointments within a specified date range.
- **Query Parameters**:
  - `start` (ISO 8601 DateTime): Start of the date range.
  - `end` (ISO 8601 DateTime): End of the date range.
- **Response**: `200 OK`

---

**Note**: Dates should be provided in ISO 8601 format (`YYYY-MM-DDTHH:MM:SS`).