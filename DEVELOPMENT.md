# Development Guide

## Quick Start

### 1. Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

### 2. Backend Development

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
# or
source venv/bin/activate     # Unix/MacOS

# Run the backend
cd backend
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs for API documentation

## Testing

### Frontend Tests

```bash
cd frontend

# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run only property tests
pytest -m property

# Run only unit tests
pytest -m unit

# Run with coverage
pytest --cov=app --cov-report=html
```

## Code Quality

### Frontend

```bash
cd frontend

# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npx prettier --check .
```

### Backend

```bash
cd backend

# Format code
black app/ tests/

# Check formatting
black --check app/ tests/

# Type checking
mypy app/
```

## Docker Development

### Build and run with Docker Compose

```bash
docker-compose up --build
```

This will start the backend on http://localhost:8000

### Build backend Docker image manually

```bash
cd backend
docker build -t bhavcopy-backend .
docker run -p 8000:8000 bhavcopy-backend
```

## Project Structure Details

### Frontend Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components (to be created)
├── lib/                   # Utilities and stores (to be created)
│   ├── store.ts          # Zustand store
│   └── api.ts            # API client
├── __tests__/            # Test files
├── vitest.config.ts      # Vitest configuration
├── vitest.setup.ts       # Test setup
├── .prettierrc           # Prettier configuration
├── eslint.config.mjs     # ESLint configuration
└── package.json          # Dependencies and scripts
```

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application
│   ├── models/           # Pydantic models (to be created)
│   ├── routes/           # API routes (to be created)
│   └── services/         # Business logic (to be created)
│       ├── date_calculator.py
│       ├── scraper.py
│       ├── processor.py
│       └── exporter.py
├── tests/
│   ├── __init__.py
│   └── test_health.py    # Basic health check test
├── Dockerfile            # Docker configuration
├── requirements.txt      # Python dependencies
├── pytest.ini           # Pytest configuration
└── pyproject.toml       # Black and MyPy configuration
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)

```env
# Add environment variables as needed
CORS_ORIGINS=http://localhost:3000
```

## Common Issues and Solutions

### Issue: Virtual environment not activating

**Solution:**
- Windows: Ensure execution policy allows scripts: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Unix/MacOS: Ensure you're using `source` command: `source venv/bin/activate`

### Issue: Port already in use

**Solution:**
- Frontend (3000): `npx kill-port 3000`
- Backend (8000): `npx kill-port 8000`

### Issue: Module not found errors

**Solution:**
- Frontend: Delete `node_modules` and run `npm install`
- Backend: Ensure virtual environment is activated and run `pip install -r requirements.txt`

### Issue: Tests not running

**Solution:**
- Frontend: Ensure Vitest is installed: `npm install -D vitest`
- Backend: Ensure pytest is installed: `pip install pytest`

## Next Steps

After completing the project setup (Task 1), the next tasks are:

1. **Task 2**: Implement backend date calculation module
2. **Task 3**: Implement backend web scraper module
3. **Task 4**: Implement backend data processor module
4. **Task 5**: Implement backend Excel exporter module

Refer to `.kiro/specs/bhavcopy-pro-enterprise/tasks.md` for the complete implementation plan.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [AG Grid Documentation](https://www.ag-grid.com/react-data-grid/)
- [Vitest Documentation](https://vitest.dev/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Hypothesis Documentation](https://hypothesis.readthedocs.io/)
