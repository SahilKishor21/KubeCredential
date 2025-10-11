# API Documentation

## Issuance Service API

Base URL: `http://localhost:3001/api`

### Health Check
```
GET /health
```

### Issue Credential
```
POST /issue
Content-Type: application/json

{
  "id": "CRED-123",
  "holderName": "John Doe",
  "holderEmail": "john@example.com",
  "credentialType": "Certificate",
  "issueDate": "2025-01-10T10:00:00.000Z",
  "expiryDate": "2026-01-10T10:00:00.000Z",
  "metadata": {}
}
```

### Get Credential
```
GET /credentials/:id
```

### Get All Credentials
```
GET /credentials
```

## Verification Service API

Base URL: `http://localhost:3002/api`

### Health Check
```
GET /health
```

### Verify Credential
```
POST /verify
Content-Type: application/json

{
  "id": "CRED-123"
}
```

### Get Logs
```
GET /logs
GET /logs?credentialId=CRED-123
```
