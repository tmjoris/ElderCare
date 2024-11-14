# Medications API Documentation

Base URL: `/api/medications`

## Authorization Requirements
All endpoints require:
- Valid username parameter
- Staff role
- Specific privilege level:
  - `editor`: Basic medication management
  - `supervisor`: Advanced querying and listing

## Endpoints

### Add Medication
`POST /`

Creates a new medication record.

**Required Authorization:**
- Staff role
- `editor` privilege

**Query Parameters:**
- `username` (string): Username of the requesting user

**Request Body:**
```json
{
  "medicationName": "string",
  "dosage": "string",
  "frequency": "string",
  "startDate": "datetime",
  "endDate": "datetime",
  "medicalRecordId": "long"
}
```

**Responses:**
- `201 Created`: Medication created successfully
  ```json
  {
    "id": "long",
    "medicationName": "string",
    "dosage": "string",
    "frequency": "string",
    "startDate": "datetime",
    "endDate": "datetime",
    "medicalRecordId": "long",
    "createdAt": "datetime"
  }
  ```
- `400 Bad Request`: "Invalid medication request"
- `500 Internal Server Error`: "An error occurred"

### Get All Medications
`GET /`

Retrieves all medications.

**Required Authorization:**
- Staff role
- `supervisor` privilege

**Query Parameters:**
- `username` (string): Username of the requesting user

**Response:** `200 OK`
Array of medication responses

### Get Medications by Medical Record
`GET /record/{medicalRecordId}`

Retrieves all medications associated with a specific medical record.

**Required Authorization:**
- Staff role
- `editor` privilege

**Path Parameters:**
- `medicalRecordId` (long): ID of the medical record

**Query Parameters:**
- `username` (string): Username of the requesting user

**Responses:**
- `200 OK`: Array of medication responses
- `404 Not Found`: "Medical record not found"
- `500 Internal Server Error`: "An error occurred"

### Delete Medication
`DELETE /{medicationId}`

Deletes a specific medication.

**Required Authorization:**
- Staff role
- `editor` privilege

**Path Parameters:**
- `medicationId` (long): ID of the medication to delete

**Query Parameters:**
- `username` (string): Username of the requesting user

**Responses:**
- `204 No Content`: "Medication deleted successfully"
- `404 Not Found`: "Medication not found"
- `500 Internal Server Error`: "An error occurred"

### Get Active Medications
`GET /active`

Retrieves all currently active medications.

**Required Authorization:**
- Staff role
- `supervisor` privilege

**Query Parameters:**
- `username` (string): Username of the requesting user

**Response:** `200 OK`
Array of medication responses

### Search Medications by Name
`GET /search`

Searches medications by name pattern.

**Required Authorization:**
- Staff role
- `supervisor` privilege

**Query Parameters:**
- `name` (string): Medication name search pattern
- `username` (string): Username of the requesting user

**Response:** `200 OK`
Array of medication responses

### Get Expiring Medications
`GET /expiring`

Retrieves medications that are expiring soon.

**Required Authorization:**
- Staff role
- `editor` privilege

**Query Parameters:**
- `username` (string): Username of the requesting user

**Response:** `200 OK`
Array of medication responses

## Data Models

### MedicationRequest
```json
{
  "medicationName": "string",
  "dosage": "string",
  "frequency": "string",
  "startDate": "datetime",
  "endDate": "datetime",
  "medicalRecordId": "long"
}
```

### MedicationResponse
```json
{
  "id": "long",
  "medicationName": "string",
  "dosage": "string",
  "frequency": "string",
  "startDate": "datetime",
  "endDate": "datetime",
  "medicalRecordId": "long",
  "createdAt": "datetime"
}
```

## Common Error Responses

All endpoints may return these error responses:
- `400 Bad Request`: Invalid request parameters or body
- `401 Unauthorized`: Missing or invalid username
- `403 Forbidden`: Insufficient privileges or invalid role
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server error

## Date Format
All datetime fields should be provided in ISO 8601 format:
- Example: `2024-01-01T00:00:00Z`
