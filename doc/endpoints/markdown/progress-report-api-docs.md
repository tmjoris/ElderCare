---

# Progress Report API Documentation

### Base URL
`/api/progress-reports`

---

### Create Progress Report

- **URL**: `/api/progress-reports`
- **Method**: `POST`
- **Description**: Creates a new progress report.
- **Request Body**:
  ```json
  {
    "patientId": "Long",
    "caregiverId": "Long",
    "date": "ISO 8601 DateTime",
    "summary": "String",
    "recommendations": "String"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": "Long",
    "patientId": "Long",
    "caregiverId": "Long",
    "date": "ISO 8601 DateTime",
    "summary": "String",
    "recommendations": "String",
    "createdAt": "ISO 8601 DateTime"
  }
  ```

---

### Delete Progress Report

- **URL**: `/api/progress-reports/{id}`
- **Method**: `DELETE`
- **Description**: Deletes a progress report by ID.
- **Path Parameter**:
  - `id` (Long): ID of the progress report.
- **Response**: `204 No Content`

---

### Get All Progress Reports

- **URL**: `/api/progress-reports`
- **Method**: `GET`
- **Description**: Retrieves all progress reports.
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "Long",
      "patientId": "Long",
      "caregiverId": "Long",
      "date": "ISO 8601 DateTime",
      "summary": "String",
      "recommendations": "String",
      "createdAt": "ISO 8601 DateTime"
    }
  ]
  ```

---

### Get Reports by Patient

- **URL**: `/api/progress-reports/patient/{patientId}`
- **Method**: `GET`
- **Description**: Retrieves all progress reports for a specific patient.
- **Path Parameter**:
  - `patientId` (Long): ID of the patient.
- **Response**: `200 OK`

---

### Get Reports by Caregiver

- **URL**: `/api/progress-reports/caregiver/{caregiverId}`
- **Method**: `GET`
- **Description**: Retrieves all progress reports for a specific caregiver.
- **Path Parameter**:
  - `caregiverId` (Long): ID of the caregiver.
- **Response**: `200 OK`

---

### Get Reports by Date Range

- **URL**: `/api/progress-reports/range`
- **Method**: `GET`
- **Description**: Retrieves progress reports within a specified date range.
- **Query Parameters**:
  - `start` (ISO 8601 DateTime): Start of the date range.
  - `end` (ISO 8601 DateTime): End of the date range.
- **Response**: `200 OK`

---

### Search Reports by Keyword

- **URL**: `/api/progress-reports/search`
- **Method**: `GET`
- **Description**: Searches progress reports by a keyword in the summary or recommendations.
- **Query Parameter**:
  - `keyword` (String): Keyword to search in the report content.
- **Response**: `200 OK`

---

**Note**: Dates should be provided in ISO 8601 format (`YYYY-MM-DDTHH:MM:SS`).