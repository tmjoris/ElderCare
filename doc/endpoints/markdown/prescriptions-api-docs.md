---

# Prescription API Documentation

### Base URL
`/api/prescriptions`

---

### Create Prescription

- **URL**: `/api/prescriptions`
- **Method**: `POST`
- **Description**: Creates a new prescription.
- **Request Body**: 
  ```json
  {
    "medicalRecordId": "Long",
    "medicationId": "Long",
    "doctorId": "Long",
    "instructions": "String",
    "issuedDate": "ISO 8601 DateTime"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "Long",
    "medicalRecordId": "Long",
    "medicationId": "Long",
    "doctorId": "Long",
    "instructions": "String",
    "issuedDate": "ISO 8601 DateTime",
    "createdAt": "ISO 8601 DateTime"
  }
  ```
- **Error Responses**:
  - `500 Internal Server Error`: An error occurred while creating the prescription.

---

### Delete Prescription

- **URL**: `/api/prescriptions/{id}`
- **Method**: `DELETE`
- **Description**: Deletes a prescription by ID.
- **Path Parameter**:
  - `id`: ID of the prescription to delete.
- **Response**: `200 OK`
  - Success message: "Prescription deleted successfully"
- **Error Responses**:
  - `404 Not Found`: Prescription not found.
  - `500 Internal Server Error`: An error occurred while deleting the prescription.

---

### Get All Prescriptions

- **URL**: `/api/prescriptions`
- **Method**: `GET`
- **Description**: Retrieves all prescriptions.
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "Long",
      "medicalRecordId": "Long",
      "medicationId": "Long",
      "doctorId": "Long",
      "instructions": "String",
      "issuedDate": "ISO 8601 DateTime",
      "createdAt": "ISO 8601 DateTime"
    }
  ]
  ```
- **Error Responses**:
  - `500 Internal Server Error`: An error occurred while fetching prescriptions.

---

### Get Prescriptions by Medical Record

- **URL**: `/api/prescriptions/medicalRecord/{medicalRecordId}`
- **Method**: `GET`
- **Description**: Retrieves prescriptions associated with a specific medical record.
- **Path Parameter**:
  - `medicalRecordId`: ID of the medical record.
- **Response**: `200 OK`
- **Error Responses**:
  - `404 Not Found`: Medical record not found.
  - `500 Internal Server Error`: An error occurred while fetching prescriptions by medical record.

---

### Get Prescriptions by Doctor

- **URL**: `/api/prescriptions/doctor/{doctorId}`
- **Method**: `GET`
- **Description**: Retrieves prescriptions created by a specific doctor.
- **Path Parameter**:
  - `doctorId`: ID of the doctor.
- **Response**: `200 OK`
- **Error Responses**:
  - `404 Not Found`: Doctor not found.
  - `500 Internal Server Error`: An error occurred while fetching prescriptions by doctor.

---

### Get Prescriptions by Medication

- **URL**: `/api/prescriptions/medication/{medicationId}`
- **Method**: `GET`
- **Description**: Retrieves prescriptions for a specific medication.
- **Path Parameter**:
  - `medicationId`: ID of the medication.
- **Response**: `200 OK`
- **Error Responses**:
  - `404 Not Found`: Medication not found.
  - `500 Internal Server Error`: An error occurred while fetching prescriptions by medication.

---

### Get Active Prescriptions

- **URL**: `/api/prescriptions/active`
- **Method**: `GET`
- **Description**: Retrieves all active prescriptions.
- **Response**: `200 OK`
- **Error Responses**:
  - `500 Internal Server Error`: An error occurred while fetching active prescriptions.

---

### Get Prescriptions by Date Range

- **URL**: `/api/prescriptions/dateRange`
- **Method**: `GET`
- **Description**: Retrieves prescriptions issued within a specified date range.
- **Query Parameters**:
  - `startDate`: Start date in ISO 8601 DateTime format.
  - `endDate`: End date in ISO 8601 DateTime format.
- **Response**: `200 OK`
- **Error Responses**:
  - `500 Internal Server Error`: An error occurred while fetching prescriptions by date range.

---

### Get Prescriptions by Patient ID

- **URL**: `/api/prescriptions/patient/{patientId}`
- **Method**: `GET`
- **Description**: Retrieves prescriptions associated with a specific patient.
- **Path Parameter**:
  - `patientId`: ID of the patient.
- **Response**: `200 OK`
- **Error Responses**:
  - `404 Not Found`: Patient not found.
  - `500 Internal Server Error`: An error occurred while fetching prescriptions by patient.

---