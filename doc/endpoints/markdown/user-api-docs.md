# User Management API Documentation

Base URL: `/api/users`

## Authentication Endpoints

### Register User
`POST /register`

Creates a new user account.

**Request Body:**
```json
{
  "username": "string",
  "firstName": "string",
  "secondName": "string",
  "password": "string",
  "email": "string",
  "primaryLocation": "string",
  "role": "string",
  "privileges": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": "long",
  "username": "string",
  "firstName": "string",
  "secondName": "string",
  "email": "string",
  "primaryLocation": "string",
  "secondaryLocation": "string",
  "phoneNumber": "string",
  "role": "string",
  "privileges": "string",
  "createdAt": "datetime"
}
```

### Login
`POST /login`

Authenticates a user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**
- `200 OK`: "Login successful"
- `401 Unauthorized`: Error message

## User Management Endpoints

### Update User
`PUT /{id}`

Updates an existing user's information.

**Request Body:**
```json
{
  "email": "string",
  "primaryLocation": "string",
  "secondaryLocation": "string",
  "phoneNumber": "string",
  "role": "string",
  "privileges": "string"
}
```

**Response:** `200 OK`
```json
{
  "id": "long",
  "username": "string",
  // ... (same as registration response)
}
```

### Delete User
`DELETE /delete`

Deletes a user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**
- `204 No Content`: User deleted successfully
- `404 Not Found`: Error message

### Validate User Access
`GET /{id}/validate`

Validates user access privileges.

**Parameters:**
- `id` (path): User ID
- `required_access` (query): Required access level

**Responses:**
- `200 OK`: "Access granted"
- `403 Forbidden`: "Access denied"
- `404 Not Found`: "User not found"
- `500 Internal Server Error`: "An error occurred"

## Search and Filter Endpoints

### Find by Username
`GET /username/{username}`

**Response:** `200 OK`
```json
{
  "id": "long",
  "username": "string",
  // ... (same as registration response)
}
```

### Find by Role
`GET /role/{role}`

**Response:** `200 OK`
Array of user objects

### Find by Privileges
`GET /privileges/{privileges}`

**Response:** `200 OK`
Array of user objects

### Find by Email
`GET /email/{email}`

**Response:** `200 OK`
Array of user objects

### Find by Primary Location
`GET /primary-location/{primaryLocation}`

**Response:** `200 OK`
Array of user objects

### Find by Secondary Location
`GET /secondary-location/{secondaryLocation}`

**Response:** `200 OK`
Array of user objects

### Find by Role and Privileges
`GET /role/{role}/privileges/{privileges}`

**Response:** `200 OK`
Array of user objects

### Search Users
`GET /search/{searchTerm}`

Performs a general search across user data.

**Response:** `200 OK`
Array of user objects

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Invalid request parameters or body
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Data Models

### UserRegistrationRequest
```json
{
  "username": "string",
  "firstName": "string",
  "secondName": "string",
  "password": "string",
  "email": "string",
  "primaryLocation": "string",
  "role": "string",
  "privileges": "string"
}
```

### UserUpdateRequest
```json
{
  "email": "string",
  "primaryLocation": "string",
  "secondaryLocation": "string",
  "phoneNumber": "string",
  "role": "string",
  "privileges": "string"
}
```

### UserResponse
```json
{
  "id": "long",
  "username": "string",
  "firstName": "string",
  "secondName": "string",
  "email": "string",
  "primaryLocation": "string",
  "secondaryLocation": "string",
  "phoneNumber": "string",
  "role": "string",
  "privileges": "string",
  "createdAt": "datetime"
}
```

### LoginRequest
```json
{
  "username": "string",
  "password": "string"
}
```
