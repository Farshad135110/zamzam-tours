# One-Time Tour & Quotation Sync Fixes

## Issues Found & Fixed

### 1. ❌ ISSUE: One-Time Tour UPDATE not syncing to Quotation
**File:** `pages/api/tours/[id].ts`  
**Status:** ✅ FIXED

**Problem:**
- When a one-time tour was edited, only the `one_time_tours` table was updated
- The linked `quotations` table was never updated
- Show old tour details when viewing quotation

**Solution:**
- Added sync logic to UPDATE `quotations` table after updating `one_time_tours`
- Sync fields: `tour_name`, `duration_days`, `base_price`
- Quotation is found using the `quotation_id` stored in the one_time_tours record

**Code Change:**
```typescript
// After updating one_time_tours, now also update quotations
if (tour.quotation_id) {
  const quotationUpdateQuery = `
    UPDATE quotations
    SET
      tour_name = COALESCE($1, tour_name),
      duration_days = COALESCE($2, duration_days),
      base_price = COALESCE($3, base_price)
    WHERE quotation_id = $4
  `;
  // ... execute query
}
```

---

### 2. ❌ ISSUE: One-Time Tour DELETE leaving orphaned Quotation data
**File:** `pages/api/tours/[id].ts`  
**Status:** ✅ FIXED

**Problem:**
- When a one-time tour was deleted, the quotation still existed with old tour data
- Quotation had no reference to tour, but contained cached values
- Data inconsistency

**Solution:**
- When deleting a one-time tour, find its linked quotation
- Set the quotation's `service_id` to NULL
- This breaks the association cleanly

**Code Change:**
```typescript
// Before deletion, get quotation_id
const getTourQuery = `SELECT quotation_id FROM one_time_tours WHERE tour_id = $1`;
const getTourResult = await pool.query(getTourQuery, [id]);
const quotationId = getTourResult.rows[0].quotation_id;

// Delete the tour, then update quotation
// UPDATE quotations SET service_id = NULL WHERE quotation_id = $quotationId
```

---

### 3. ❌ ISSUE: Direct Quotation updates not syncing to One-Time Tour
**File:** `pages/api/quotations/[id].ts`  
**Status:** ✅ FIXED

**Problem:**
- When admin edited quotation (tour_name, duration_days, or base_price), the one-time tour was not updated
- Two different sources of truth created inconsistency

**Solution:**
- Added reverse sync: when quotation is updated, sync changes to linked one-time tour
- Only sync if quotation has a linked one-time tour (service_id starts with 'OT')
- Handle sync gracefully (doesn't fail request if sync fails)

**Code Change:**
```typescript
// After updating quotation, sync to one-time tour if it exists
if (serviceId && serviceId.startsWith('OT')) {
  const syncableFields = ['tour_name', 'duration_days', 'base_price'];
  const fieldsToSync = Object.keys(updates).filter(key => syncableFields.includes(key));
  
  if (fieldsToSync.length > 0) {
    // UPDATE one_time_tours with new values
  }
}
```

---

## Affected Operations

### Sync Points

| Operation | Location | Sync Direction | Fields Synced |
|-----------|----------|-----------------|---------------|
| Update One-Time Tour | PUT `/api/tours/[id]` | → Quotation | tour_name, duration_days, base_price |
| Delete One-Time Tour | DELETE `/api/tours/[id]` | → Quotation | service_id = NULL |
| Update Quotation | PUT `/api/quotations/[id]` | → One-Time Tour | tour_name, duration_days, base_price |

### Safe Operations (No Sync Needed)

- **Create Quotation**: service_id is set at creation time ✅
- **Delete Quotation**: CASCADE delete in DB cleans up one-time tours ✅
- **Create One-Time Tour**: Properly linked to quotation ✅

---

## Testing Checklist

### Test 1: Update One-Time Tour → See Quotation Updated
```
1. Go to Admin → Quotations
2. Find a quotation with a one-time tour
3. Click Edit Package
4. Change tour name, price, or days
5. Click Save
6. View the quotation (customer view)
7. ✅ Verify new values appear
```

### Test 2: Update Quotation → See Tour Updated
```
1. Go to Admin → Quotations
2. Click Edit Quotation
3. Change Tour Package Name or Duration or Price
4. Click Save
5. Go to Admin → One-Time Tours (if section exists)
6. ✅ Verify the tour values are updated
```

### Test 3: Delete One-Time Tour → See Quotation Cleaned
```
1. Go to Admin → Quotations
2. Find a quotation with a one-time tour
3. Click Delete Tour
4. Confirm deletion
5. Reopen the quotation
6. ✅ Verify quotation still exists but service_id is NULL
```

---

## Database Relationships

### One-Time Tour & Quotation

```
one_time_tours
├── tour_id (PK)
├── tour_name
├── price
├── days
├── quotation_id (FK → quotations.quotation_id) ON DELETE CASCADE
└── ...

quotations
├── quotation_id (PK)
├── service_id (can = one_time_tour.tour_id)
├── tour_name (SYNCED)
├── duration_days (SYNCED)
├── base_price (SYNCED)
└── ...
```

### Key Points
- `quotations.service_id` stores the one_time_tours.tour_id when it's a one-time tour
- One-time tours start with 'OT' prefix (e.g., OT00001)
- Package IDs start with different prefixes (e.g., PKG001)

---

## Implementation Notes

### Sync Logic Gracefully Fails
- If sync fails, the main operation continues
- Errors are logged to console but don't propagate to API response
- This prevents cascading failures

### Fields That Auto-Calculate
```typescript
nights = duration_days - 1  // Automatically calculated
```

### NULL Handling
- `COALESCE()` is used to only update fields that were explicitly provided
- Prevents overwriting with null values

---

## Related Documentation
- See `CREATE_TOURS_IN_QUOTATIONS_GUIDE.md` for user workflow
- See `QUOTATION_SERVICES_AUTO_FETCH.md` for service auto-fetch logic
- See `RUNTIME_LOGGING_GUIDE.md` for logging instrumentation details
