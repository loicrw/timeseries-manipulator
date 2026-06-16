# Project Overview

Complete technical overview of structure, architecture, and configuration.

## Project Structure

```
timeseries-manipulator/
├── docs/                  # Documentation
├── server-py/             # Python + Polars backend
│   ├── main.py
│   ├── pyproject.toml
│   └── .venv/
├── src/                   # React frontend
│   ├── App.tsx
│   └── types.ts
├── public/data/           # CSV files (9 series, 175k points each)
├── package.json
└── generate_data_simple.py
```

## Architecture

```
User Browser (http://localhost:5173)
         ↓ React app loads
React Frontend (Vite)
         ↓ HTTP API calls
Python Backend (Flask, port 3001)
         ↓ Polars DataFrame operations
CSV Files (public/data/*.csv)
```

### Component Responsibilities

| Component | Role | Performance Critical |
|-----------|------|---------------------|
| React Frontend | UI, API calls, state management | Chart rendering (WebGL) |
| Flask API | HTTP endpoints, CORS | Lightweight |
| Polars Engine | CSV parsing, aggregation, joins | ✅ All data processing |
| CSV Storage | Raw data storage | Initial load only |

## Data Specifications

**CSV Format:**
```csv
timestamp,energy_kwh
2021-01-01T00:00:00,523.45
2021-01-01T00:15:00,518.32
```

**Series Types:**

| Type | Pattern | Avg (kWh) | Variability |
|------|---------|-----------|-------------|
| Base Load | Seasonal cycles | 500 | Low |
| Residential | Daily peaks (morning/evening) | 50-60 | Medium |
| Commercial | Business hours (8am-6pm) | 40-50 | High |
| Industrial | Constant with shutdowns | 130-160 | Low |

**Aggregation Levels:**

| Level | Points | Use Case |
|-------|--------|----------|
| Raw | 175,296 | Detailed analysis |
| Daily | 1,825 | Weekly/monthly patterns |
| Monthly | 60 | Seasonal trends |
| Yearly | 5 | Multi-year comparison |

## Configuration

### Backend (server-py/main.py)

```python
# Port
app.run(host="0.0.0.0", port=3001, debug=True)

# CORS
CORS(app)  # Allow all origins

# Caching
df_cache: Dict[str, pl.DataFrame] = {}  # In-memory
```

### Frontend (src/App.tsx)

```typescript
const API_BASE = 'http://localhost:3001/api';
```

### Vite (vite.config.ts)

```typescript
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
```

## Dependencies

**Backend (pyproject.toml):**
- polars ^1.41.2
- flask ^3.1.3
- flask-cors ^6.0.5

**Frontend (package.json):**
- react ^18.2.0
- plotly.js ^2.27.0
- typescript ^5.2.2
- vite ^5.0.8

## Development Workflow

### Make Changes

**Backend:** Edit `server-py/main.py` → Flask auto-reloads  
**Frontend:** Edit `src/App.tsx` → Vite HMR updates instantly

### Test

```bash
# Backend API
curl http://localhost:3001/api/series

# Frontend
# Open browser, interact with UI

# Automated verification
./test-setup.sh
```

### Build for Production

```bash
npm run build          # Frontend → dist/
npm run preview        # Test production build

# Backend (use Gunicorn)
cd server-py
uv add gunicorn
uv run gunicorn -w 4 -b 0.0.0.0:3001 main:app
```

## Documentation Map

**For Users:**
1. [README.md](README.md) - Overview
2. [QUICK_START.md](QUICK_START.md) - 5-minute setup
3. [docs/USAGE.md](docs/USAGE.md) - UI guide

**For Developers:**
1. [docs/SETUP.md](docs/SETUP.md) - Installation
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
3. [docs/API.md](docs/API.md) - API reference

**For Contributors:**
1. [docs/CHANGELOG.md](docs/CHANGELOG.md) - Version history
2. [docs/FEATURES.md](docs/FEATURES.md) - Feature list

## License

MIT License

---

Version 3.0 | Last updated: 2026-06-16
