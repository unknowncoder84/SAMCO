# PE/CE Filter Update - Separate Checkboxes

## What Changed

### Previous Implementation ❌
- Single checkbox: "Exclude PE/CE Options"
- All-or-nothing approach
- Couldn't filter PE and CE separately

### New Implementation ✅
- Two separate checkboxes:
  1. "Include PE (Put Options)" - checked by default
  2. "Include CE (Call Options)" - checked by default
- Independent control over each option type
- Uncheck to exclude that type

---

## How It Works

### Example Data:
```
Symbol    Expiry        Strike   Type   Close
TCS       28-Apr-2026   2,320    PE     0.30
TCS       24-Feb-2026   2,300    CE     706.60
RELIANCE  28-Mar-2026   2,500    PE     11.50
RELIANCE  28-Mar-2026   2,500    CE     52.00
```

### Scenario 1: Both Checked (Default)
- ✅ Include PE: Checked
- ✅ Include CE: Checked
- **Result**: All 4 rows included

### Scenario 2: Exclude PE
- ❌ Include PE: Unchecked
- ✅ Include CE: Checked
- **Result**: Only CE rows (2 rows)
```
TCS       24-Feb-2026   2,300    CE     706.60
RELIANCE  28-Mar-2026   2,500    CE     52.00
```

### Scenario 3: Exclude CE
- ✅ Include PE: Checked
- ❌ Include CE: Unchecked
- **Result**: Only PE rows (2 rows)
```
TCS       28-Apr-2026   2,320    PE     0.30
RELIANCE  28-Mar-2026   2,500    PE     11.50
```

### Scenario 4: Exclude Both
- ❌ Include PE: Unchecked
- ❌ Include CE: Unchecked
- **Result**: No rows (empty file)

---

## UI Design

### Location
Below the column selection grid in the CSV to Excel Converter

### Layout
```
┌─────────────────────────────────────────────────────────┐
│ 🎯 Option Type Filters                                  │
├──────────────────────────┬──────────────────────────────┤
│ ☑ Include PE             │ ☑ Include CE                 │
│   (Put Options)          │   (Call Options)             │
│   PE rows will be        │   CE rows will be            │
│   included               │   included                   │
└──────────────────────────┴──────────────────────────────┘
```

### Visual Feedback
- Checked: "PE/CE rows will be included" (green text)
- Unchecked: "PE/CE rows will be excluded" (red text)

---

## Technical Implementation

### Frontend (`FileProcessor.tsx`)

**State Variables:**
```typescript
const [includePE, setIncludePE] = useState(true);
const [includeCE, setIncludeCE] = useState(true);
```

**API Call:**
```typescript
formData.append('include_pe', includePE.toString());
formData.append('include_ce', includeCE.toString());
```

### Backend (`main.py`)

**Endpoint Parameters:**
```python
include_pe: str = Form(default="true")
include_ce: str = Form(default="true")
```

**Filter Logic:**
```python
# Filter PE if not included
if not should_include_pe:
    mask = df.astype(str).apply(
        lambda x: x.str.upper().str.contains(r'\bPE\b', na=False, regex=True)
    ).any(axis=1)
    df = df[~mask]

# Filter CE if not included
if not should_include_ce:
    mask = df.astype(str).apply(
        lambda x: x.str.upper().str.contains(r'\bCE\b', na=False, regex=True)
    ).any(axis=1)
    df = df[~mask]
```

**Pattern Matching:**
- Uses word boundary regex: `\bPE\b` and `\bCE\b`
- Case-insensitive matching
- Checks all columns in the row
- If ANY column contains PE/CE, the entire row is filtered

---

## Testing

### Test Results ✅

```
Original: 6 rows (3 PE + 3 CE)

Test 1 - Exclude PE:
  Result: 3 CE rows ✓

Test 2 - Exclude CE:
  Result: 3 PE rows ✓

Test 3 - Exclude Both:
  Result: 0 rows ✓

Test 4 - Include Both:
  Result: 6 rows ✓
```

---

## User Workflow

1. **Download CSV**
   - Click "Download CSV File"
   - File downloads: `bhavcopy_20260219_NSE_FO.csv`

2. **Upload to Converter**
   - Upload the CSV file
   - Select columns to keep

3. **Configure Filters**
   - By default, both PE and CE are included
   - Uncheck "Include PE" to remove Put options
   - Uncheck "Include CE" to remove Call options
   - Or keep both checked to include all data

4. **Convert & Download**
   - Click "Convert to Excel & Download"
   - Excel file downloads with filtered data

---

## Files Changed

1. `frontend/components/FileProcessor.tsx`
   - Added `includePE` and `includeCE` state
   - Updated UI with two separate checkboxes
   - Sends both flags to backend

2. `backend/app/main.py`
   - Updated `/api/process-csv-to-excel` endpoint
   - Added `include_pe` and `include_ce` parameters
   - Implemented separate filtering logic

3. `backend/requirements.txt`
   - Added database dependencies for future Supabase integration

---

## Benefits

1. **Flexibility**: Filter PE and CE independently
2. **User Control**: Clear checkboxes with visual feedback
3. **Default Behavior**: Both included by default (no surprises)
4. **Smart Filtering**: Word boundary matching prevents false positives
5. **Performance**: Efficient pandas operations

---

## Next Steps

- ✅ PE/CE filter implemented
- ✅ Filename issue fixed
- 🔄 Supabase integration (optional - see DEPLOYMENT_GUIDE.md)
- 🔄 Deploy to production

---

## Status: ✅ COMPLETE

Both requested features are now working:
1. ✅ Separate PE/CE filter checkboxes
2. ✅ Filename format corrected
