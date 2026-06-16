# Changelog

## Version 3.0 - Polars Backend (2026-06-16)

### Major Changes

#### Python + Polars Backend
- Complete backend rewrite from JavaScript to Python + Polars
- Server-side processing for all aggregation and series operations
- In-memory DataFrame caching for instant subsequent queries
- Significantly faster performance with Rust-based operations
- Reduced memory usage with columnar storage

#### Backend Stack
- Python 3.13
- uv (fast Python package manager)
- Polars 1.41 (Rust-based DataFrame library)
- Flask 3.1 (lightweight web framework)
- Flask-CORS (cross-origin resource sharing)

#### Frontend Changes
- API client: Frontend makes HTTP calls to Python backend
- Lightweight state: Only stores aggregated results
- Maintained WebGL: Still uses scattergl for smooth rendering
- Same UX: No user-facing changes, just faster performance

#### New Architecture
```
React Frontend (Browser, Port 5173)
         ↓ HTTP API calls
Python Backend (Flask + Polars, Port 3001)
         ↓ DataFrame operations
CSV Files (175k points each)
```

#### API Endpoints
- `GET /api/series` - List available time series
- `GET /api/base?aggregation={level}` - Get base series with aggregation
- `POST /api/running-total` - Calculate combined series with aggregation

### Technical Changes
- **server-py/**: New Python backend directory with main.py
- **pyproject.toml**: uv project configuration
- **.venv/**: Auto-created Python virtual environment
- **server/**: Legacy Node.js backend kept as fallback
- **src/App.tsx**: Refactored to use API instead of client-side processing

### Documentation Updates
- **docs/**: All documentation moved to organized docs folder
- **README.md**: Updated with Polars setup instructions
- **docs/SETUP.md**: Comprehensive installation and troubleshooting guide
- **docs/API.md**: Complete API reference
- **docs/ARCHITECTURE.md**: System design with Polars details
- **docs/PERFORMANCE.md**: Benchmarks and comparisons
- **docs/USAGE.md**: User guide (unchanged experience)

### Files Modified
- `package.json`: Updated scripts (npm run server uses Python)
- `src/App.tsx`: API client instead of local data processing
- All documentation files reorganized and updated

### Files Added
- `server-py/main.py`: Python + Polars backend
- `server-py/pyproject.toml`: uv dependencies
- `docs/SETUP.md`: Setup guide
- `docs/API.md`: API documentation
- `docs/PERFORMANCE.md`: Performance comparison

### Breaking Changes
- **Requires Python 3.12+** and uv to run backend
- **Two processes**: Must run both backend (port 3001) and frontend (port 5173)
- **API dependency**: Frontend won't work without backend running

### Migration Notes
For users upgrading from v2.0:
1. Install Python 3.12+ and uv
2. Run `npm install`
3. Start backend: `npm run server`
4. Start frontend: `npm run dev`
5. Same UI/UX, faster performance

### Fallback
If Python setup fails, use Node.js backend:
```bash
npm run server:node
```

---

## Version 2.0 - Multi-Series Support (2026-06-16)

### Major Changes

#### Data Generation
- **5 years of data**: Extended from 1 year (2025) to 5 years (2021-2025)
- **3 versions per type**: Generated 9 total series
  - Residential 1, 2, 3 (different scales: 100%, 90%, 110%)
  - Commercial 1, 2, 3 (different scales: 100%, 90%, 110%)
  - Industrial 1, 2, 3 (different scales: 100%, 90%, 110%)
- **175,296 data points** per series (up from 35,040)
- Updated Python generator with parameterized functions

#### Frontend Features
- **Multiple series support**: Load unlimited series simultaneously
- **Repeatable selections**: Same series can be selected multiple times
- **Series management**: 
  - Visual tags with color indicators
  - One-click removal with × button
  - Series count display
- **9-color palette**: Expanded from 3 colors
- **Auto-load**: Still loads Residential 1 on startup

#### UI Changes
- New "Loaded Series" panel with colored tags
- Remove buttons (×) on each series tag
- Updated dropdown with all 9 series options
- Dropdown automatically resets after selection

### Technical Changes
- Added `LoadedSeries` interface with `instanceId`
- Refactored state management for array of loaded series
- Removed base/additional series distinction
- Updated aggregation for arbitrary number of series
- Color cycling for unlimited series

### Files Modified
- `generate_data_simple.py`: Extended to 5 years, 3 versions each
- `src/App.tsx`: Complete refactor for multi-series support
- `src/types.ts`: Added LoadedSeries interface
- `src/App.css`: Added styles for series tags

### Files Added
- 9 CSV files in `public/data/` (residential, commercial, industrial × 3)

---

## Version 1.0 - Initial Release

### Features
- 3 sample time series (1 year each)
- Auto-load base series
- Interactive Plotly charts with zoom/pan
- Single additional series comparison
- Divergence visualization
- 4 aggregation levels (Raw, Daily, Monthly, Yearly)
- 35,040 data points per series
