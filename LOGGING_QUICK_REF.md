# Runtime Logging - Quick Reference

## Access Logs During Testing

### 1. View All Logs
```javascript
logger.getLogs()
```

### 2. View Logs by Module
```javascript
// Quotation creation flow
logger.getLogs('QUOTATION_FORM')
logger.getLogs('QUOTATION_API')

// Package/tour editing
logger.getLogs('PACKAGE_EDIT')
logger.getLogs('TOUR_EDIT')
logger.getLogs('TOUR_API')

// One-time tours
logger.getLogs('ONE_TIME_TOUR')

// Image uploads
logger.getLogs('IMAGE_UPLOAD')

// Package API
logger.getLogs('PACKAGE_API')
```

### 3. View Logs by Level
```javascript
logger.getLogs(undefined, 'ERROR')    // Only errors
logger.getLogs(undefined, 'WARN')     // Only warnings
logger.getLogs(undefined, 'DEBUG')    // Only debug messages
```

### 4. Combine Filters
```javascript
// All errors from quotation flow
logger.getLogs('QUOTATION_API', 'ERROR')

// All debug messages from package editing
logger.getLogs('PACKAGE_EDIT', 'DEBUG')
```

### 5. Export for Issue Reporting
```javascript
// Copy logs to clipboard
copy(logger.exportLogs())

// Paste in issue description or save as JSON file
```

### 6. View Summary
```javascript
console.log(logger.getSummary())
```

Output:
```
📊 Runtime Logger Summary:
  Total Logs: 45
  By Module: {"QUOTATION_FORM":12,"QUOTATION_API":8,"TOUR_EDIT":15,...}
  By Level: {"INFO":25,"DEBUG":15,"WARN":3,"ERROR":2}
  Latest: "Quotation created successfully"
```

### 7. Clear Logs
```javascript
logger.clear()
```

## Common Testing Scenarios

### Scenario 1: Create Quotation with One-Time Tour
1. Open admin page
2. Fill out quotation form
3. Check logs: `logger.getLogs('QUOTATION_FORM')`
4. Submit form
5. Check logs: `logger.getLogs('QUOTATION_API')`
6. Verify one-time tour creation: `logger.getLogs('ONE_TIME_TOUR')`
7. Export if any errors: `copy(logger.exportLogs())`

### Scenario 2: Edit Package from Quotation
1. Click "Edit Package Details" button
2. Check logs: `logger.getLogs('PACKAGE_EDIT')`
3. Verify fetch success and data mapping
4. Make changes in EditTourModal
5. Click Save
6. Check logs: `logger.getLogs('TOUR_EDIT')`
7. Verify modal reopening: `logger.getLogs('PACKAGE_EDIT')`

### Scenario 3: Troubleshoot Authentication Error
1. Perform operation that fails
2. Run: `logger.getLogs(undefined, 'ERROR')`
3. Look for "401 Unauthorized" or auth-related errors
4. Check logs: `logger.getLogs('PACKAGE_EDIT')` or similar
5. Export logs: `copy(logger.exportLogs())`

### Scenario 4: Verify Validation
1. Submit form with invalid data (wrong email, past date, etc.)
2. Check logs: `logger.getLogs('QUOTATION_FORM', 'WARN')`
3. Verify all validation errors are logged
4. Look for specific field names in error details

### Scenario 5: Debug Image Upload
1. Create quotation with vehicle service type
2. Upload vehicle images
3. Check logs: `logger.getLogs('IMAGE_UPLOAD')`
4. Verify each file upload is logged
5. Check for success confirmations or upload errors

## Browser Console Commands

### View formatted log table
```javascript
console.table(logger.getLogs())
```

### Get specific data from logs
```javascript
// Get all quotation numbers created
logger.getLogs('QUOTATION_API')
  .filter(log => log.action === 'Quotation created successfully')
  .map(log => log.data?.quotationNumber)

// Get all errors during testing
logger.getLogs(undefined, 'ERROR')
  .map(log => ({ module: log.module, error: log.error }))
```

### Monitor in real-time
```javascript
// Keep refreshing logs
setInterval(() => {
  console.clear()
  console.log(logger.getSummary())
  console.table(logger.getLogs().slice(-10))
}, 3000)
```

## What to Look For

✅ **Successful Flow Indicators:**
- Timestamps show consistent progression
- No ERROR level logs
- API responses show `success: true`
- Modal transitions logged
- State resets logged after operations

⚠️ **Warning Signs:**
- ERROR level logs
- Multiple validation errors
- Non-JSON responses (HTML content)
- Failed API responses (`success: false`)
- Missing quotation IDs or tour IDs

🔍 **Debug Steps When Issues Occur:**
1. Check ERRORs: `logger.getLogs(undefined, 'ERROR')`
2. Check WARNings: `logger.getLogs(undefined, 'WARN')`
3. Check module-specific logs for that flow
4. Export full logs: `copy(logger.exportLogs())`
5. Search for failed operation in logs
6. Look at surrounding logs for context

## Performance Monitoring

### Check number of logs (memory usage)
```javascript
const logs = logger.getLogs()
console.log(`Total logs: ${logs.length}`)
```

### Estimate memory usage
```javascript
const logs = logger.exportLogs()
const sizeInBytes = new Blob([logs]).size
console.log(`${(sizeInBytes / 1024).toFixed(2)} KB`)
```

### Clear old logs if too many
```javascript
if (logger.getLogs().length > 400) {
  logger.clear()
  console.log('Logs cleared to free memory')
}
```

## Known Modules and Their Log Modules

| User Action | Module | Key Log Fields |
|-------------|--------|----------------|
| Click "Create Quotation" | QUOTATION_FORM | serviceType, customerEmail |
| Fill form & submit | QUOTATION_FORM | validation errors, imageCount |
| API processes quotation | QUOTATION_API | quotationNumber, totalAmount |
| Click "Edit Package" | PACKAGE_EDIT | packageId, serviceType |
| Fetch package details | PACKAGE_EDIT | endpoint, isOneTimeTour |
| Edit & save package | TOUR_EDIT | tourId, updatingFields |
| Create one-time tour | ONE_TIME_TOUR | quotationId, tourName, days |
| Upload images | IMAGE_UPLOAD | fileName, fileSize, fileType |
| Create one-time tour API | TOUR_API | tourId, quotationId |
| Update package | PACKAGE_API | packageId, bodyKeys |
| Get tour | TOUR_API | tourId, tourName |
| Update tour | TOUR_API | tourId, updatingFields |
| Delete tour | TOUR_API | tourId |

## Log Query Patterns

### Find all actions related to a quotation number
```javascript
const quotNum = "QT202502001"
logger.getLogs()
  .filter(log => JSON.stringify(log.data).includes(quotNum))
```

### Find all failed operations
```javascript
logger.getLogs(undefined, 'ERROR')
  .map(log => `${log.module}: ${log.action} - ${log.error}`)
```

### Find slow operations (based on timestamp gaps)
```javascript
const logs = logger.getLogs()
logs.forEach((log, i) => {
  if (i > 0) {
    const gap = new Date(log.timestamp) - new Date(logs[i-1].timestamp)
    if (gap > 1000) console.log(`${gap}ms gap at ${log.action}`)
  }
})
```

## Pro Tips

1. **Keep browser console open** while testing - don't miss transient logs
2. **Export logs frequently** - sessionStorage has limits
3. **Use console.time()** to profile critical sections
4. **Search logs by keywords** using your editor find-in-file after export
5. **Compare successful vs failed flows** by exporting both and diffing
6. **Share exported logs** with team for collaborative debugging
