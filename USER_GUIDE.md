# Bhavcopy Pro - User Guide

## Quick Start

### 1. Download CSV Data

1. **Select Date**: Choose the trading date you want data for
2. **Select Segment**: NSE F&O is selected by default
3. **Click "Download CSV File"**
4. File downloads automatically

### 2. Convert CSV to Excel

1. **Upload CSV**: Click "Browse" and select your downloaded CSV
2. **Select Columns**: Choose which columns to keep
3. **Filter Options** (Optional):
   - Uncheck "Include PE" to remove Put options
   - Uncheck "Include CE" to remove Call options
4. **Click "Convert to Excel & Download"**
5. Formatted Excel file downloads

---

## Important Information

### Data Availability

#### Today's Data
- **Available After**: 6:00 PM IST
- **Before 6:00 PM**: Data not available yet
- **Error Message**: "Data for today is not available yet. Please try again after 6:00 PM"

#### Solution:
- Wait until after 6:00 PM IST
- OR select a previous date (yesterday or earlier)

### Weekends
- **Saturday/Sunday**: No data available (market closed)
- **Error Message**: "Market is closed on weekends"
- **Solution**: Select a weekday

### Holidays
- **Market Holidays**: No data available
- **Error Message**: "This may be a holiday"
- **Solution**: Select a different date

---

## Common Issues & Solutions

### Issue 1: "404. No data available"

**Cause**: Data not published yet or date is a holiday/weekend

**Solutions**:
1. Check the time - if before 6:00 PM IST, wait or select previous date
2. Check if selected date is a weekend - select a weekday
3. Check if selected date is a holiday - select a different date

### Issue 2: "Download failed"

**Cause**: Network issue or backend not running

**Solutions**:
1. Check internet connection
2. Refresh the page
3. Try again in a few minutes

### Issue 3: Empty or No Data

**Cause**: Selected date has no trading data

**Solutions**:
1. Verify date is a trading day (not weekend/holiday)
2. Try a different date
3. Check if segment has data for that date

---

## Features

### Date Selection
- **Range**: January 2020 to Current Date
- **Quick Buttons**:
  - "Today" - Selects current date
  - "Feb 13, 2026" - Latest date with confirmed F&O data

### Segment Selection
- **NSE Cash**: Equity cash market
- **NSE F&O**: Futures & Options (default)
- **MCX**: Commodity market

### Column Filtering
- Select only the columns you need
- Reduces file size
- Makes data easier to work with

### PE/CE Filtering
- **Include PE**: Keep/Remove Put options
- **Include CE**: Keep/Remove Call options
- Both checked by default (all data included)

### Year Filtering
- Automatically filters data to selected year only
- If you select Feb 20, 2026 → only 2026 data shown
- No manual filtering needed

---

## File Naming

### CSV Files
- Format: `bhavcopy_YYYYMMDD_SEGMENT.csv`
- Example: `bhavcopy_20260220_NSE_FO.csv`

### Excel Files
- Format: `original_name_filtered.xlsx`
- Example: `bhavcopy_20260220_NSE_FO_filtered.xlsx`

---

## Best Practices

### For Daily Use
1. Wait until after 6:00 PM IST
2. Select today's date
3. Download NSE F&O data
4. Convert to Excel with your preferred columns

### For Historical Analysis
1. Select date range you need
2. Download data for each date
3. Combine in Excel or use multiple files

### For Options Trading
1. Download NSE F&O data
2. Use PE/CE filters to focus on specific option types
3. Select relevant columns (Symbol, Expiry, Strike, Type, Close)

---

## Tips

### Faster Downloads
- Select only one segment at a time
- Use previous dates (data already available)

### Better Excel Files
- Deselect unnecessary columns
- Use PE/CE filters to reduce rows
- Smaller files = faster processing

### Avoid Errors
- Don't select today's date before 6:00 PM IST
- Avoid weekends (Saturday/Sunday)
- Check market holiday calendar

---

## Data Publishing Schedule

### Samco Publishing Time
- **Daily**: After 6:00 PM IST
- **Delay**: Usually 30-60 minutes after market close
- **Market Close**: 3:30 PM IST
- **Data Available**: ~6:00-6:30 PM IST

### Recommended Download Time
- **Best Time**: After 7:00 PM IST
- **Reason**: Ensures data is fully published
- **Alternative**: Next morning for previous day's data

---

## Support

### If You Encounter Issues

1. **Check Error Message**: Read the error carefully
2. **Check Time**: Is it after 6:00 PM IST?
3. **Check Date**: Is it a weekday?
4. **Try Different Date**: Select a previous date
5. **Refresh Page**: Clear cache and reload

### Error Messages Explained

| Error | Meaning | Solution |
|-------|---------|----------|
| "404. No data available" | File not found | Wait or select different date |
| "Data not available yet" | Too early | Wait until after 6:00 PM |
| "Market is closed on weekends" | Weekend selected | Select a weekday |
| "This may be a holiday" | Holiday selected | Select a different date |
| "Download failed" | Network/server issue | Refresh and try again |

---

## Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter**: Submit/Download (when button focused)
- **Escape**: Close dialogs
- **Ctrl+R**: Refresh page

---

## Browser Compatibility

### Supported Browsers
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari

### Minimum Versions
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

---

## System Requirements

### Minimum
- Internet connection
- Modern web browser
- 2 GB RAM

### Recommended
- Stable internet (5+ Mbps)
- Latest browser version
- 4 GB RAM

---

## Privacy & Security

- No data is stored on our servers
- All processing happens in real-time
- Files are downloaded directly to your device
- No personal information collected

---

## Updates

Check the app regularly for:
- New features
- Bug fixes
- Performance improvements
- UI enhancements

---

## Quick Reference

### Data Availability
- ⏰ After 6:00 PM IST daily
- 📅 Weekdays only
- 🚫 No weekends/holidays

### File Formats
- 📥 Download: CSV
- 📊 Convert: Excel (XLSX)

### Segments
- 💹 NSE Cash
- 📈 NSE F&O (default)
- 🌾 MCX

### Filters
- ✅ Column selection
- 🎯 PE/CE options
- 📆 Year filtering (automatic)

---

## Need Help?

If you're still having issues:
1. Read this guide carefully
2. Check error messages
3. Try different dates/times
4. Contact support with:
   - Error message
   - Date selected
   - Time of attempt
   - Browser used

---

**Remember**: Data is published after 6:00 PM IST. If you're getting errors, check the time first!
