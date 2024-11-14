# Medical Records API Documentation

Base URL: `/api/medical-records`

## Endpoints

### Create Medical Record
`POST /`

Creates a new medical record.

**Request Body:**
```json
{
  "patientId": "long",
  "doctorId": "long",
  "dateOfVisit": "datetime",
  "location": "string",
  "diagnosis": "string",
  "treatmentPlan": "string",
  "notes": "string"
}
```

**Response:** `200 OK`
```json
{
  "id": "long",
  "patientId": "long",
  "doctorId": "long",
  "dateOfVisit": "datetime",
  "location": "string",
  "diagnosis": "string",
  "treatmentPlan": "string",
  "notes": "string",
  "createdAt": "datetime"
}
```

### Get All Medical Records
`GET /`

Retrieves all medical records.

**Response:** `200 OK`
```json
[
  {
    "id": "long",
    "patientId": "long",
    // ... (full medical record response)
  }
]
```

### Get Records by Patient
`GET /patient/{patientId}`

Retrieves all medical records for a specific patient.

**Path Parameters:**
- `patientId` (long): ID of the patient

**Response:** `200 OK`
Array of medical record responses

### Get Records by Doctor
`GET /doctor/{doctorId}`

Retrieves all medical records for a specific doctor.

**Path Parameters:**
- `doctorId` (long): ID of the doctor

**Response:** `200 OK`
Array of medical record responses

### Get Records by Patient and Doctor
`GET /patient/{patientId}/doctor/{doctorId}`

Retrieves all medical records for a specific patient-doctor combination.

**Path Parameters:**
- `patientId` (long): ID of the patient
- `doctorId` (long): ID of the doctor

**Response:** `200 OK`
Array of medical record responses

### Get Records by Location
`GET /location`

Retrieves all medical records from a specific location.

**Query Parameters:**
- `location` (string): Location name or identifier

**Response:** `200 OK`
Array of medical record responses

### Get Records by Date Range
`GET /date-range`

Retrieves all medical records within a specified date range.

**Query Parameters:**
- `startDate` (datetime, ISO 8601 format): Start of date range
- `endDate` (datetime, ISO 8601 format): End of date range

**Example Request:**
```
GET /api/medical-records/date-range?startDate=2024-01-01T00:00:00Z&endDate=2024-02-01T00:00:00Z
```

**Response:** `200 OK`
Array of medical record responses

### Search Medical Records
`POST /search`

Searches medical records based on multiple criteria.

**Request Body:**
```json
{
  "patientId": "long",
  "doctorId": "long",
  "startDate": "datetime",
  "endDate": "datetime",
  "location": "string",
  "diagnosisOrTreatment": "string"
}
```

**Response:** `200 OK`
Array of medical record responses

## Data Models

### MedicalRecordRequest
```json
{
  "patientId": "long",
  "doctorId": "long",
  "dateOfVisit": "datetime",
  "location": "string",
  "diagnosis": "string",
  "treatmentPlan": "string",
  "notes": "string"
}
```

### MedicalRecordResponse
```json
{
  "id": "long",
  "patientId": "long",
  "doctorId": "long",
  "dateOfVisit": "datetime",
  "location": "string",
  "diagnosis": "string",
  "treatmentPlan": "string",
  "notes": "string",
  "createdAt": "datetime"
}
```

### MedicalRecordSearchCriteria
```json
{
  "patientId": "long",
  "doctorId": "long",
  "startDate": "datetime",
  "endDate": "datetime",
  "location": "string",
  "diagnosisOrTreatment": "string"
}
```

## Date Format
All datetime fields should be provided in ISO 8601 format:
- Example: `2024-01-01T00:00:00Z`

## Error Responses

All endpoints may return these error responses:
- `400 Bad Request`: Invalid request parameters or body
- `404 Not Found`: Requested resource not found
- `500 Internal Server Error`: Server error
