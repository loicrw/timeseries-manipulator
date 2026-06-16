# Features

## Data

- **12 time series**: 3 residential, 3 commercial, 3 industrial, 3 solar
- **175,296 data points per series**: 15-minute intervals for 5 years (2021-2025)
- **CSV storage**: Files in `public/data/`
- **Auto-load**: Residential 1 loads automatically

## Visualization

### Interactive Chart (Plotly.js)
- **Zoom**: Click and drag to select time range
- **Pan**: Drag chart or use range slider
- **Reset**: Double-click to reset view
- **Hover**: See all series values at given time
- **Range slider**: Navigate full dataset
- **WebGL rendering**: Smooth performance with large datasets

### Series Management
- **Add unlimited series**: Select from dropdown
- **Same series multiple times**: For comparison with different multipliers
- **Color-coded sidebar**: Each series displayed in left sidebar with unique color indicator
- **Positive/negative multipliers**: Independent scaling for positive and negative values
  - Default multipliers: 1.0 (no scaling)
  - Example: Positive multiplier 1.5 scales consumption by 50%, negative multiplier 0.8 reduces solar generation by 20%
- **One-click removal**: × button on each series card
- **Scrollable list**: Handles 4+ series with smooth scrolling

### Year Filtering
- **Year selector dropdown**: Filter data to specific year
- **Available years**: 2021, 2022, 2023, 2024, 2025, or All Years
- **Client-side filtering**: Instant updates without backend calls
- **Works with all aggregations**: Combine with any aggregation level

## Aggregation

Five levels with button toggle:
- **Raw (15min)**: All 175,296 points per series
- **Hourly**: Averaged to ~43,824 hourly values (1-hour intervals)
- **Daily**: Averaged to ~1,825 daily values
- **Monthly**: Averaged to 60 monthly values
- **Yearly**: Averaged to 5 yearly values

Active aggregation highlighted with yellow (#FFB81C) background.

## Data Patterns

### Residential (1, 2, 3)
- Daily cycles with morning/evening peaks
- Higher baseline on weekends
- Seasonal variation (heating/cooling)
- 10% scale differences between variants

### Commercial (1, 2, 3)
- Strong weekday/weekend difference
- Business hours (8 AM - 6 PM)
- Minimal weekend usage
- Higher in summer (air conditioning)
- 10% scale differences between variants

### Industrial (1, 2, 3)
- Constant high load
- Random maintenance shutdowns (~7/year)
- Minimal seasonal variation
- 10% scale differences between variants

### Solar (1, 2, 3)
- Negative values = generation (produces energy)
- Daytime generation only (6 AM - 6 PM)
- Peak generation at solar noon
- Weather variability (cloud cover)
- Seasonal variation (more in summer, less in winter)
- 10% scale differences between variants

## Technical Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Plotly.js for interactive charts
- CSS for styling

### Backend
- Python 3.13
- uv package manager
- Polars (Rust-based DataFrame library)
- Flask web framework
- Flask-CORS

### Data Processing
- Server-side aggregation with Polars
- In-memory DataFrame caching
- Efficient CSV parsing
- Columnar storage (Apache Arrow)

## File Structure

```
timeseries-manipulator/
├── public/data/              # CSV files
├── server-py/                # Python backend
│   ├── main.py
│   └── pyproject.toml
├── src/                      # React frontend
│   ├── App.tsx
│   ├── types.ts
│   └── App.css
├── docs/                     # Documentation
├── generate_data_simple.py   # Data generation
└── package.json
```

## User Interface

### Controls Panel (Top Bar)
- Series selection dropdown
- Aggregation toggle buttons (Raw / Hourly / Daily / Monthly / Yearly)
- Year filter dropdown (2021-2025 + All Years)
- Clear visual feedback with yellow accent color

### Sidebar (Left, 320px Fixed Width)
- **Added Series List**: Scrollable container for all added series
- **Series Cards**: Each card displays:
  - Color indicator matching chart lines
  - Series name
  - Positive multiplier input (scales positive values)
  - Negative multiplier input (scales negative values)
  - Remove button (×)
- **Empty State**: Helpful message when no series added
- **Series Counter**: Shows total count in header

### Chart Display (Right, Flexible Width)
- Responsive design that adapts to sidebar
- **Base Load line** (gray, #64696C): Original base series
- **Base + Additions line** (yellow, #FFB81C): Combined result with multipliers
- Professional color scheme
- Shadow effects and rounded corners
- Smooth interactions with WebGL rendering
- Chart traces ordered for optimal visibility (yellow line behind gray line)
