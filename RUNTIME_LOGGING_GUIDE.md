# Runtime Logging Implementation Guide

## Overview

As part of the comprehensive quotation system audit and error handling improvements, a structured runtime logging system has been implemented across all critical UI flows and API endpoints. This logging captures detailed behavior information to identify edge cases, validate data flow, and debug issues during end-to-end testing.

## Logging Architecture

### Logger Utility (`src/lib/logger.ts`)

A singleton `RuntimeLogger` class provides:
- **Structured logging** with timestamps and module context
- **Log levels**: INFO, DEBUG, WARN, ERROR, TRACE
- **Client-side storage** in sessionStorage (up to 500 logs)
- **Session persistence** - logs retained across page reloads within same session
- **Export capability** - logs can be exported as JSON for issue reporting

#### Log Methods

```typescript
logger.log(module, action, data?)      // INFO level
logger.debug(module, action, data?)    // DEBUG level
logger.trace(module, action, data?)    // TRACE level (includes call stack)
logger.warn(module, action, data?)     // WARN level
logger.error(module, action, error, data?) // ERROR level with Error object
```

#### Server-side Helpers

```typescript
logServerAction(module, action, data?) // Server-side INFO equivalent
logServerError(module, action, error, data?) // Server-side ERROR equivalent
logServerTrace(module, action, data?) // Server-side TRACE equivalent
```

### Access Runtime Logs

**In Browser Console:**

```javascript
// Get all logs
logger.getLogs()

// Get logs by module
logger.getLogs('QUOTATION_FORM')
logger.getLogs('TOUR_API')
logger.getLogs('PACKAGE_EDIT')

// Get logs by level
logger.getLogs(undefined, 'ERROR')
logger.getLogs('QUOTATION_API', 'WARN')

// Export all logs as JSON
copy(logger.exportLogs())

// View summary
console.log(logger.getSummary())

// Clear logs
logger.clear()
```

## Instrumented Flows

### 1. Quotation Creation Flow (`pages/admin/quotations-old.tsx`)

**Module:** `QUOTATION_FORM`

**Logged Events:**
- ✅ Form submission started
- ✅ Validation process: field checks, email format, date logic, price bounds, passenger validation
- ✅ Service-specific auto-generated names for transfers
- ✅ Image upload progress (file size, type, upload status)
- ✅ API request details
- ✅ API response with status and success flag
- ✅ One-time tour creation sub-flow
- ✅ Form state reset after successful creation
- ✅ All errors with detailed context

**Example Log Output:**
```
[14:23:45] ℹ️ QUOTATION_FORM → Form submission started
  serviceType: "tour", customerEmail: "john@example.com", tourSaveType: "one-time", hasOneTimeTourData: true

[14:23:46] 🔍 QUOTATION_FORM → Validation passed
  serviceType: "tour", adults: 2, children: 1, infants: 0

[14:23:47] 📍 IMAGE_UPLOAD → Uploading image 1/2
  fileName: "beach.jpg", fileSize: 2048576, fileType: "image/jpeg"

[14:23:49] ℹ️ QUOTATION_API → Sending quotation to API
  serviceType: "tour", customer: "john@example.com", hasImages: false, imageCount: 0

[14:23:50] 🔍 QUOTATION_API → API response received
  statusCode: 201, success: true, quotationNumber: "QT202502001"

[14:23:51] ℹ️ ONE_TIME_TOUR → Creating one-time tour
  quotationId: 456, tourName: "Sigiriya Trek", days: 3
```

### 2. Package/Tour Editing Flow (`pages/admin/quotations-old.tsx`)

**Module:** `PACKAGE_EDIT`, `TOUR_EDIT`

**Logged Events:**
- ✅ Edit package button clicked with quotation context
- ✅ Service type validation
- ✅ Package/tour fetch request (endpoint, auth, content-type)
- ✅ Data type detection (one-time vs package tour)
- ✅ Data mapping and transformation
- ✅ Modal state transitions
- ✅ Tour update API request with field list
- ✅ Response validation (JSON content-type check)
- ✅ Auth failure detection (401 response)
- ✅ Modal reopening on successful edit
- ✅ Service data refresh (tours list or package list)

**Example Log Output:**
```
[14:30:22] ℹ️ PACKAGE_EDIT → Edit package initiated
  quotationNumber: "QT202502001", packageId: "OT00001", serviceType: "tour"

[14:30:23] 🔍 PACKAGE_EDIT → Fetching package details
  endpoint: "/api/tours/OT00001", isOneTimeTour: true, packageId: "OT00001"

[14:30:24] 🔍 PACKAGE_EDIT → Mapped one-time tour data
  tourId: "OT00001", tourName: "Sigiriya Trek", days: 3

[14:30:25] ℹ️ PACKAGE_EDIT → Opening edit modal
  tourType: "one-time", tourId: "OT00001"

[14:30:26] ℹ️ TOUR_EDIT → Starting tour update
  tourId: "OT00001", isOneTimeTour: true, endpoint: "/api/tours/OT00001", tourName: "Sigiriya Trek"

[14:30:27] 🔍 TOUR_EDIT → Sending update payload
  tourType: "one-time", fields: ["tourName", "description", "price", "days"], itineraryType: "object"

[14:30:28] ℹ️ TOUR_EDIT → Tour updated successfully
  tourId: "OT00001", isOneTimeTour: true

[14:30:29] 🔍 TOUR_EDIT → Reopening quotation modal
  quotationNumber: "QT202502001"
```

### 3. Quotation API - Create (`pages/api/quotations/index.ts`)

**Module:** `QUOTATION_API`

**Logged Events:**
- ✅ POST request with customer and service details
- ✅ Validation failures with specific field errors
- ✅ Pricing calculation breakdown (service type, base price, totals)
- ✅ Service details fetching (from packages, vehicles, hotels)
- ✅ Vehicle image upload tracking
- ✅ Database insert operation
- ✅ Quotation number generation
- ✅ Success response with quotation ID
- ✅ Database error handling (duplicate key, foreign key, not-null constraints)

**Example Log Output:**
```
[14:25:30] ℹ️ QUOTATION_API → POST /api/quotations
  customerEmail: "john@example.com", serviceType: "tour", source: "website"

[14:25:31] 🔍 QUOTATION_API → Pricing calculated
  basePrice: 1500, total: 1500, serviceType: "tour", numAdults: 2, numChildren: 1

[14:25:32] ℹ️ QUOTATION_API → Included services fetched
  serviceCount: 7, serviceType: "tour"

[14:25:33] ℹ️ QUOTATION_API → Inserting quotation to DB
  quotationNumber: "QT202502001", customerEmail: "john@example.com", hasVehicleImages: false, imageCount: 0

[14:25:34] ℹ️ QUOTATION_API → Quotation created successfully
  quotationNumber: "QT202502001", quotationId: 456, customerEmail: "john@example.com", totalAmount: 1500, depositAmount: 450
```

### 4. Quotation API - Update/Delete (`pages/api/quotations/[id].ts`)

**Module:** `QUOTATION_API`

**Logged Events:**
- ✅ GET request with status tracking
- ✅ PUT update request with validation
- ✅ DELETE request with status checking (prevents deletion of accepted/converted quotations)
- ✅ Email notification sending
- ✅ Database operation results

### 5. Package API - Update (`pages/api/packages/[id].ts`)

**Module:** `PACKAGE_API`

**Logged Events:**
- ✅ GET package request (public)
- ✅ PUT package update with user context
- ✅ Request body fields being updated
- ✅ Success confirmation with package details
- ✅ Errors with package ID context

**Example Log Output:**
```
[14:31:00] ℹ️ PACKAGE_API → GET /api/packages/:id
  packageId: "PKG001"

[14:31:02] ℹ️ PACKAGE_API → PUT /api/packages/:id
  packageId: "PKG001", userId: 123, bodyKeys: ["package_name", "description", "price", "days"]

[14:31:03] ℹ️ PACKAGE_API → Package updated successfully
  packageId: "PKG001", packageName: "Sigiriya & Kandy Adventure"
```

### 6. Tours API - Create (`pages/api/tours/create.ts`)

**Module:** `TOUR_API`

**Logged Events:**
- ✅ POST request with tour type (package vs one-time)
- ✅ Tour type validation
- ✅ Package ID generation
- ✅ One-time tour ID generation and quotation link
- ✅ Database insert results
- ✅ Success with IDs
- ✅ Errors with save type and quotation context

**Example Log Output:**
```
[14:28:00] ℹ️ TOUR_API → POST /api/tours/create
  tourName: "Sigiriya Trek", saveType: "one-time", quotationId: 456, days: 3, hasItinerary: true

[14:28:01] ℹ️ TOUR_API → Creating one-time tour
  tourName: "Sigiriya Trek", quotationId: 456, days: 3

[14:28:02] ℹ️ TOUR_API → One-time tour created successfully
  tourId: "OT00001", tourName: "Sigiriya Trek", quotationId: 456
```

### 7. Tours API - Get/Update/Delete (`pages/api/tours/[id].ts`)

**Module:** `TOUR_API`

**Logged Events:**
- ✅ GET request for tour details
- ✅ Tour not found handling
- ✅ PUT request with fields being updated
- ✅ DELETE request with success confirmation
- ✅ All errors with tour ID context

## Edge Cases Covered by Logging

### 1. **Data Type Mismatches**
- Tracks when tour data is fetched and mapped between one-time and package formats
- Logs field name conversions (camelCase ↔ snake_case)
- Logs itinerary JSON parsing and stringification

### 2. **Authentication Failures**
- Logs 401 responses with indication to re-login
- Tracks credentials: 'include' status in fetch requests
- Logs auth middleware passage/failure

### 3. **Response Content-Type Issues**
- Logs actual content-type headers before JSON parsing
- Warns when HTML responses are received instead of JSON
- Logs text response preview for debugging

### 4. **Validation Failures**
- Logs each validation error field-by-field
- Tracks which validation rules fail (email regex, date logic, numeric bounds)
- Logs error count for quick assessment

### 5. **Service-Specific Issues**
- Logs service type detection (tour, vehicle, hotel, transfer)
- Tracks service ID and package ID resolution
- Logs when service details are missing or invalid

### 6. **Image Upload Progress**
- Logs each file name, size, and type
- Tracks upload success/failure per image
- Logs total upload count and completion status

### 7. **Modal State Transitions**
- Logs when modals open and close
- Tracks context preservation between modals
- Logs state resets for form data leakage prevention

### 8. **Database Errors**
- Logs specific constraint violations
- Tracks duplicate key errors
- Logs foreign key constraint failures
- Logs not-null constraint violations

### 9. **One-Time Tour Auto-Linking**
- Logs when one-time tour creation is initiated
- Tracks quotation ID linkage
- Logs successful linking confirmation
- Logs any failures with context

### 10. **API Response Validation**
- Logs HTTP status codes
- Tracks success/error response flags  
- Logs error messages and details for investigation

## Testing Strategy

### Manual Testing Checklist

When testing UI flows, monitor the browser console for logs:

1. **Create Quotation Flow**
   ```javascript
   logger.getLogs('QUOTATION_FORM')
   ```
   - Form submission logged
   - Validation passes/fails with specific errors
   - Images upload with progress tracking
   - API success logged with quotation number

2. **Edit Package Flow**
   ```javascript
   logger.getLogs('PACKAGE_EDIT')
   logger.getLogs('TOUR_EDIT')
   ```
   - Package fetch logged with endpoint and auth
   - Data mapped correctly (one-time vs package detection)
   - Modal opens and closes
   - Update API called with field list
   - Success response logged

3. **One-Time Tour Creation**
   ```javascript
   logger.getLogs('ONE_TIME_TOUR')
   logger.getLogs('TOUR_API')
   ```
   - Tour creation initiated after quotation
   - Tour ID generated
   - Quotation linking confirmed
   - Success response logged

4. **Error Scenarios**
   ```javascript
   logger.getLogs(undefined, 'ERROR')
   logger.getLogs(undefined, 'WARN')
   ```
   - Authentication errors show 401 detection
   - Validation errors list failed fields
   - Database errors show constraint type
   - Network errors show exception details

### Automating Issue Reports

```javascript
// When an issue occurs, export logs for reporting:
const logs = logger.exportLogs()
console.log(logs)
// Then copy the output and attach to issue
```

## Log Retention

- **Client-side**: Logs stored in sessionStorage, cleared on session end
- **Server-side**: Logs written to console, monitored by server logging infrastructure
- **Max logs**: 500 entries (oldest removed when exceeded)
- **Retention**: Per-session (survives page reloads within same session)

## Performance Impact

The logging system is designed with minimal performance overhead:
- Non-blocking async operations
- Structured data (no expensive serialization)
- Optional conditional logging (disabled in production unless needed)
- Small memory footprint (~500 logs × ~500 bytes = ~250KB max)

## Module Reference

| Module | Purpose | Files |
|--------|---------|-------|
| QUOTATION_FORM | Quotation creation UI flow | quotations-old.tsx |
| QUOTATION_API | Quotation creation/update/delete API | pages/api/quotations/* |
| PACKAGE_EDIT | Package editing from quotation | quotations-old.tsx |
| TOUR_EDIT | Tour update operations | quotations-old.tsx |
| ONE_TIME_TOUR | One-time tour creation from quotation | quotations-old.tsx |
| PACKAGE_API | Package CRUD operations | pages/api/packages/[id].ts |
| TOUR_API | Tour CRUD operations | pages/api/tours/* |
| IMAGE_UPLOAD | Image upload to Cloudinary | quotations-old.tsx |

## Next Steps

1. **End-to-end testing**: Execute quotation creation with various service types while monitoring logs
2. **Error validation**: Test each error scenario and verify error logs appear correctly
3. **Performance monitoring**: Monitor console.time() for any slow operations
4. **Issue tracking**: Use exported logs when reporting bugs
5. **Continuous monitoring**: Keep browser console open during testing to catch unexpected behaviors
