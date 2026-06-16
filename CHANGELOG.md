# Changelog

## Version 2.0 - Multi-Series Support (2026-06-16)

### Major Changes

#### Data Generation
- **5 years of data**: Extended from 1 year (2025) to 5 years (2021-2025)
- **3 versions per type**: Generated 9 total series instead of 3
  - Residential 1, 2, 3 (different scales: 100%, 90%, 110%)
  - Commercial 1, 2, 3 (different scales: 100%, 90%, 110%)
  - Industrial 1, 2, 3 (different scales: 100%, 90%, 110%)
- **175,296 data points** per series (up from 35,040)
- Updated Python generator with parameterized functions for variations

#### Frontend Features
- **Multiple series support**: Can now load unlimited series simultaneously
- **Repeatable selections**: Same series can be selected multiple times
- **Series management**: 
  - Visual tags showing loaded series with color indicators
  - One-click removal with × button
  - Series count display
- **Removed divergence visualization**: Simplified to focus on multi-series comparison
- **9-color palette**: Expanded from 3 colors to support more series
- **Auto-load**: Still loads Residential 1 on startup

#### UI Changes
- New "Loaded Series" panel with colored tags
- Remove buttons (×) on each series tag
- Updated dropdown to show all 9 series options
- Dropdown automatically resets after selection
- Color indicators match chart line colors

### Technical Changes
- Added `LoadedSeries` interface with `instanceId` for tracking multiple instances
- Refactored state management to use array of loaded series
- Removed base/additional series distinction
- Updated aggregation to handle arbitrary number of series
- Color cycling logic for unlimited series support

### Documentation Updates
- Updated README.md with new feature descriptions
- Updated FEATURES.md with multi-series capabilities
- Updated USAGE_GUIDE.md with new workflows and data characteristics
- Added this CHANGELOG.md

### Files Modified
- `generate_data_simple.py`: Extended to 5 years, 3 versions each
- `src/App.tsx`: Complete refactor for multi-series support
- `src/types.ts`: Added LoadedSeries interface
- `src/App.css`: Added styles for series tags and management UI
- Documentation files (README, FEATURES, USAGE_GUIDE)

### Files Added
- `public/data/residential_1.csv` (4.4 MB)
- `public/data/residential_2.csv` (4.4 MB)
- `public/data/residential_3.csv` (4.4 MB)
- `public/data/commercial_1.csv` (4.4 MB)
- `public/data/commercial_2.csv` (4.4 MB)
- `public/data/commercial_3.csv` (4.4 MB)
- `public/data/industrial_1.csv` (4.6 MB)
- `public/data/industrial_2.csv` (4.6 MB)
- `public/data/industrial_3.csv` (4.6 MB)

### Files Removed
- `public/data/residential.csv` (old 1-year data)
- `public/data/commercial.csv` (old 1-year data)
- `public/data/industrial.csv` (old 1-year data)

### Performance
- Successfully handles 175k+ data points per series
- Smooth interaction with multiple series loaded
- Client-side aggregation remains fast
- No performance degradation with 5+ series loaded simultaneously

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
