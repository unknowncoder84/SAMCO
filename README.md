# SAMCO Bhavcopy Downloader

A modern web application for downloading bhavcopy (market data) files from Samco for NSE, BSE, and MCX segments.

## Features

- 📥 **Direct CSV Download** - Download raw CSV files from Samco for any trading date
- 📊 **Excel Conversion** - Convert CSV files to formatted Excel with column filtering
- 🎯 **Multiple Segments** - Support for NSE Cash, NSE F&O, BSE, and MCX
- 📅 **Date Selection** - Pick any trading date to download data
- 🔍 **PE/CE Filtering** - Separate filters for Put and Call options
- 🎨 **Modern UI** - Clean, responsive interface built with Next.js and Tailwind CSS
- 🤖 **Browser Automation** - Uses Playwright to reliably download files from Samco

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **Playwright** - Browser automation for reliable downloads
- **Pandas** - Data processing
- **OpenPyXL** - Excel file generation

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/unknowncoder84/SAMCO.git
cd SAMCO
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
playwright install chromium
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running Locally

1. **Start Backend** (in `backend` directory)
```bash
uvicorn app.main:app --reload --port 8000
```

2. **Start Frontend** (in `frontend` directory)
```bash
npm run dev
```

3. **Open Browser**
```
http://localhost:3000
```

## Usage

### Download CSV Files

1. Select a date using the date picker
2. Choose segment(s): NSE Cash, NSE F&O, BSE, or MCX
3. Click "Download CSV File"
4. File downloads automatically to your Downloads folder

### Convert CSV to Excel

1. Go to the File Processor section
2. Upload a CSV file
3. Select columns to include
4. Choose PE/CE filtering options
5. Click "Convert to Excel"
6. Download the formatted Excel file

## API Documentation

### Health Check
```bash
GET /api/health
```

### Download CSV
```bash
POST /api/download-csv
Content-Type: application/json

{
  "segments": ["NSE_FO"],
  "date": "2026-02-20"
}
```

### Convert CSV to Excel
```bash
POST /api/process-csv-to-excel
Content-Type: multipart/form-data

file: <csv_file>
columns: ["SYMBOL", "EXPIRY_DT", "STRIKE_PR", "OPTION_TYP"]
include_pe: true
include_ce: true
```

## Deployment

### Netlify (Frontend)

The frontend is configured for Netlify deployment with `netlify.toml`.

**Deploy Steps:**
1. Push code to GitHub
2. Connect repository to Netlify
3. Netlify will auto-deploy using the configuration

**Build Settings:**
- Build command: `cd frontend && npm install && npm run build`
- Publish directory: `frontend/.next`

### Backend Deployment

The backend requires a server that supports Python and Playwright. Options:

1. **Railway** - Easy Python deployment
2. **Render** - Free tier available
3. **DigitalOcean** - Full control
4. **AWS/GCP** - Enterprise scale

**Environment Variables:**
```bash
CORS_ORIGINS=https://your-frontend-url.netlify.app
```

## Project Structure

```
SAMCO/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── playwright_scraper.py # Browser automation
│   │   ├── simple_downloader.py  # Subprocess wrapper
│   │   ├── data_processor.py     # Data processing
│   │   ├── excel_exporter.py     # Excel generation
│   │   └── ...
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Home page
│   │   ├── history/             # History page
│   │   └── settings/            # Settings page
│   ├── components/
│   │   ├── MainConsole.tsx      # Download interface
│   │   ├── FileProcessor.tsx    # CSV to Excel converter
│   │   ├── DatePicker.tsx       # Date selection
│   │   └── ...
│   ├── lib/
│   │   ├── store.ts             # Zustand state
│   │   └── api.ts               # API client
│   └── package.json
├── docker-compose.yml           # Docker setup
├── netlify.toml                 # Netlify config
└── README.md
```

## How It Works

1. **User selects date and segment** in the frontend
2. **Frontend sends request** to backend API
3. **Backend launches Playwright** browser in headless mode
4. **Browser navigates** to Samco bhavcopy page
5. **Sets date range** in the form inputs
6. **Submits form via AJAX** to get file list for that date
7. **Parses response HTML** to extract download links
8. **Downloads the file** by clicking the link
9. **Returns file** to frontend for user download

## Key Features Explained

### Browser Automation
Uses Playwright to interact with Samco's website like a real user, ensuring reliable downloads even when the website structure changes.

### Form Submission
The Samco page uses AJAX form submission. The system:
- Sets date inputs programmatically
- Submits form via JavaScript fetch()
- Parses the HTML response to get download links
- Downloads files directly from the parsed URLs

### Year Filtering
Automatically filters data to show only records for the selected year, useful for F&O data with multiple expiry years.

### PE/CE Filtering
Separate checkboxes allow excluding Put (PE) or Call (CE) options from Excel exports using word-boundary regex matching.

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.11+)
- Install dependencies: `pip install -r requirements.txt`
- Install Playwright browsers: `playwright install chromium`

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Clear cache: `rm -rf node_modules .next && npm install`

### Downloads fail
- Check backend is running on port 8000
- Check Playwright is installed: `playwright install chromium`
- Check internet connection to Samco website

### File not found errors
- Verify the date is a trading day (not weekend/holiday)
- Check if Samco has uploaded the file (usually after 6 PM IST)
- Try a different date that you know has data

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation in the repo

## Acknowledgments

- Samco for providing the bhavcopy data
- Playwright team for the excellent browser automation tool
- Next.js and FastAPI communities

---

**Built with ❤️ for traders and developers**
