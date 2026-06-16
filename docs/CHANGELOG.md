# Changelog

## Version 3.2 - Multipliers & Enhancements (2026-06-16)

### Added
- **Separate positive/negative multipliers** for each added series
  - Positive multiplier scales all positive values independently
  - Negative multiplier scales all negative values independently
  - Default multipliers: 1.0 (no scaling)
  - Real-time updates when multipliers change
- **Hourly aggregation level**: New option between Raw and Daily
  - 43,824 hourly data points (1-hour intervals)
  - Backend: Polars `dt.truncate("1h")` for efficient aggregation
- **Year filtering**: Client-side filtering to specific years
  - Dropdown options: All Years, 2021, 2022, 2023, 2024, 2025
  - Works with all aggregation levels
  - Instant filtering without backend calls
- **Updated color scheme**: Professional styling throughout
  - Primary yellow: #FFB81C (Base + Additions line)
  - Gray: #64696C (Base Load line)
  - Dark blue: #003D5C (text accents)
  - Applied to buttons, inputs, and interactive elements
- **Sidebar layout**: Reorganized UI with fixed left sidebar
  - 320px fixed-width sidebar for added series
  - Scrollable series list (handles 4+ series)
  - Each series card shows color, name, multipliers, and remove button
  - Flexible chart container on right side

### Modified
- **Backend API** (`server-py/main.py`):
  - `add_series()` now accepts series configs with multipliers
  - Polars conditional logic: `pl.when()` for separate positive/negative scaling
  - `aggregate_dataframe()` supports `"hourly"` aggregation
- **Frontend** (`src/App.tsx`):
  - `AddedSeriesMetadata` interface includes `positiveMultiplier` and `negativeMultiplier`
  - Year filtering state and logic
  - Trace order swapped: Base + Additions renders first, Base Load on top
  - Multiplier update function for real-time changes
  - API calls send multiplier configs
- **Types** (`src/types.ts`):
  - `AggregationType` includes `'hourly'`
- **Styles** (`src/App.css`):
  - Flexbox layout with sidebar and main content areas
  - Updated color scheme throughout
  - Scrollable series list with custom scrollbar
  - Multiplier inputs stack vertically in series cards

### UI/UX Improvements
- **Chart trace order**: Gray baseline draws on top of yellow combined line for better visibility
- **Multiplier inputs**: Clear labels ("Positive multiplier", "Negative multiplier")
- **Empty state**: Helpful message when no series added
- **Series counter**: Shows count in sidebar header
- **Consistent styling**: Yellow accent on all interactive elements

### Technical Changes
- Backend multiplier logic uses Polars expressions for performance
- Client-side year filtering avoids unnecessary API calls
- CSS flexbox prevents chart overflow beyond top bar
- Multiplier state managed per series instance

### Documentation Updates
- **README.md**: Updated features list and usage instructions
- **docs/FEATURES.md**: Added multipliers, hourly aggregation, year filtering, UI layout
- **docs/USAGE.md**: Comprehensive workflows with multiplier examples
- **docs/API.md**: Updated endpoints with multiplier configs and hourly aggregation
- **PROJECT_OVERVIEW.md**: Added hourly aggregation to table
- All documentation updated to reflect new features

### Use Cases Enabled
- **Load forecasting**: Scale consumption up/down with positive multipliers
- **Solar modeling**: Reduce generation impact with negative multipliers < 1.0
- **Scenario analysis**: Compare multiple versions of same series with different scales
- **Year-over-year comparison**: Filter to single year for focused analysis
- **Intraday patterns**: Hourly aggregation for detailed daily cycle analysis

---

## Version 3.1 - Solar Series (2026-06-16)

### Added
- **3 solar generation series** with negative values (generation)
- Daytime-only generation pattern (6 AM - 6 PM)
- Peak generation at solar noon
- Weather variability with cloud cover simulation
- Seasonal variation (higher summer, lower winter)
- Updated total series count from 9 to 12

### Modified
- Data generator: Added `generate_solar()` function
- Backend API: Added solar_1, solar_2, solar_3 to series list
- Documentation: Updated all references from 9 to 12 series
- CSV files: Generated 3 new solar_*.csv files (4.4MB each)

---

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
