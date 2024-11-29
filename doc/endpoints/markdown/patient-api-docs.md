# Patient Management API Documentation

Base URL: `/api/patients`

## Authorization Levels
This API uses role-based access control with the following privileges:
- `editor`: Can create and view patients
- `supervisor`: Can perform searches, deletions, and advanced operations

## Endpoints

### Create Patient
`POST /`

Creates a new patient record.

**Required Role:** `editor`

**Query Parameters:**
- `username` (string): Username of the requesting user

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "dob": "date",
  "gender": "string",
  "address": "string",
  "phoneNumber": "string",
  "emergencyContact": "string",
  "emergencyContactPhone": "string"
}
```

**Responses:**
- `201 Created`: Patient created successfully
  ```json
  {
    "id": "long",
    "firstName": "string",
    "lastName": "string",
    "dob": "date",
    "gender": "string",
    "address": "string",
    "phoneNumber": "string",
    "emergencyContact": "string",
    "emergencyContactPhone": "string",
    "createdAt": "datetime"
  }
  ```
- `400 Bad Request`: Invalid request data
- `403 Forbidden`: Insufficient privileges

### Get All Patients
`GET /`

Retrieves all patients.

**Required Role:** `editor`

**Query Parameters:**
- `username` (string): Username of the requesting user

**Response:** `200 OK`
```json
[
  {
    "id": "long",
    "firstName": "string",
    "lastName": "string",
    // ... (full patient response)
  }
]
```

### Get Patient by Login
`GET /login`

Retrieves a patient's own information using their login credentials.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**
- `200 OK`: Full patient information
- `400 Bad Request`: Invalid credentials
- `403 Forbidden`: Access denied

### Delete Patient
`DELETE /{patientId}`

Deletes a patient record.

**Required Role:** `supervisor`

**Path Parameters:**
- `patientId` (long): ID of the patient to delete

**Query Parameters:**
- `username` (string): Username of the requesting user

**Responses:**
- `204 No Content`: Patient successfully deleted
- `403 Forbidden`: Insufficient privileges
- `404 Not Found`: Patient not found

## Search Endpoints

### Search by Last Name
`GET /search/lastname`

**Required Role:** `supervisor`

**Query Parameters:**
- `lastName` (string): Last name to search for
- `username` (string): Username of the requesting user

**Response:** `200 OK`
```json
[
  {
    "id": "long",
    "firstName": "string",
    "lastName": "string",
    "phoneNumber": "string"
  }
]
```

### Keyword Search
`GET /search/keyword`

**Required Role:** `supervisor`

**Query Parameters:**
- `keyword` (string): Search term
- `username` (string): Username of the requesting user

**Response:** `200 OK`
```json
[
  {
    "id": "long",
    "firstName": "string",
    "lastName": "string",
    "dob": "date",
    "gender": "string",
    "phoneNumber": "string"
  }
]
```

### Search by Age Range
`GET /search/age-range`

**Required Role:** `supervisor`

**Query Parameters:**
- `minAge` (integer): Minimum age
- `maxAge` (integer): Maximum age
- `username` (string): Username of the requesting user

**Response:** `200 OK`
```json
[
  {
    "id": "long",
    "firstName": "string",
    "lastName": "string",
    "dob": "date",
    "gender": "string",
    "phoneNumber": "string"
  }
]
```

## Data Models

### PatientRequest
```json
{
  "firstName": "string",
  "lastName": "string",
  "dob": "date",
  "gender": "string",
  "address": "string",
  "phoneNumber": "string",
  "emergencyContact": "string",
  "emergencyContactPhone": "string"
}
```

### PatientResponse
```json
{
  "id": "long",
  "firstName": "string",
  "lastName": "string",
  "dob": "date",
  "gender": "string",
  "address": "string",
  "phoneNumber": "string",
  "emergencyContact": "string",
  "emergencyContactPhone": "string",
  "createdAt": "datetime"
}
```

### PatientSearch
```json
{
  "id": "long",
  "firstName": "string",
  "lastName": "string",
  "dob": "date",
  "gender": "string",
  "phoneNumber": "string"
}
```

### PatientSummary
```json
{
  "id": "long",
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string"
}
```

## Error Responses

All endpoints may return these error responses:
- `400 Bad Request`: Invalid request parameters or body
- `403 Forbidden`: Insufficient privileges or unauthorized access
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server error
