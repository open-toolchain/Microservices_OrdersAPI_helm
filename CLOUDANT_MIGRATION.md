# Cloudant SDK Migration Guide - OrdersAPI

## Overview
This OrdersAPI microservice has been migrated from `@cloudant/cloudant` (legacy) to `@ibm-cloud/cloudant` (official IBM Cloud SDK).

## Changes Made

### 1. Package Dependencies
**Before:**
```json
"@cloudant/cloudant": "*"
```

**After:**
```json
"@ibm-cloud/cloudant": "^0.9.3",
"ibm-cloud-sdk-core": "^4.3.3"
```

### 2. Authentication
The new SDK uses IAM authentication instead of legacy authentication.

**Environment Variable Requirements:**
- `CLOUDANT_SERVICE` must contain a JSON object with:
  - `url`: Cloudant service URL
  - `apikey`: IAM API key (or `password` as fallback)

**Example:**
```json
{
  "url": "https://your-instance.cloudantnosqldb.appdomain.cloud",
  "apikey": "your-iam-api-key"
}
```

### 3. Code Changes

#### routes/orders.js
- Replaced `require('@cloudant/cloudant')` with `CloudantV1` and `IamAuthenticator`
- Updated initialization to use `CloudantV1.newInstance()`
- Created wrapper object `ordersDb` for backward compatibility:
  - `ordersDb.insert()` → `cloudant.postDocument()`
  - `ordersDb.get()` → `cloudant.getDocument()`
  - `ordersDb.list()` → `cloudant.postAllDocs()`
- Converted database initialization to async IIFE
- Updated database creation:
  - `cloudant.db.create()` → `cloudant.putDatabase()`

## Installation

Run the following command to install the new dependencies:

```bash
npm install
```

## Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Ensure `CLOUDANT_SERVICE` environment variable is properly set with IAM credentials:

```bash
export CLOUDANT_SERVICE='{"url":"https://your-instance.cloudantnosqldb.appdomain.cloud","apikey":"your-iam-api-key"}'
export WEB_PORT=3001
```

### 3. Start the Application
```bash
npm start
```

### 4. Test Endpoints

**List Orders:**
```bash
curl http://localhost:3001/rest/orders
```

**Get Order by ID:**
```bash
curl http://localhost:3001/rest/orders/{order-id}
```

**Create Order:**
```bash
curl -X POST http://localhost:3001/rest/orders \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "item123",
    "count": 2,
    "buyer": "john.doe@example.com"
  }'
```

## Key Differences

### API Style
- **Old SDK**: Callback-based API
- **New SDK**: Promise-based API (async/await)

### Authentication
- **Old SDK**: Basic auth with username/password or legacy API keys
- **New SDK**: IAM authentication with API keys

### Method Names
- **Old SDK**: `db.create()`, `db.use().insert()`, `db.use().get()`, `db.use().list()`
- **New SDK**: `putDatabase()`, `postDocument()`, `getDocument()`, `postAllDocs()`

### Database Initialization
- **Old SDK**: Synchronous callback-based initialization
- **New SDK**: Async IIFE for database creation on startup

## Troubleshooting

### Authentication Errors
- Verify `CLOUDANT_SERVICE` environment variable is set correctly
- Ensure IAM API key has proper permissions
- Check that the service URL is correct

### Database Not Found
- The database is automatically created on application startup
- Verify database name is 'orders'
- Check application logs for initialization errors

### Connection Issues
- Verify network connectivity to Cloudant service
- Check firewall rules if running in restricted environment

## Migration Notes

### Backward Compatibility
The migration maintains backward compatibility by:
- Creating wrapper methods that match the old API signature
- Supporting both callback and promise-based patterns
- Preserving the same database operations

### Test Mode
The `TEST_MODE` flag is preserved for testing purposes. Set it using:
```javascript
orders.setTestMode(true);
```

## References
- [IBM Cloud Cloudant Node.js SDK Documentation](https://github.com/IBM/cloudant-node-sdk)
- [IBM Cloud SDK Core Documentation](https://github.com/IBM/node-sdk-core)
- [Cloudant API Reference](https://cloud.ibm.com/apidocs/cloudant)