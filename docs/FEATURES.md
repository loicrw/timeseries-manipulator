# Features

## Data

- **9 time series**: 3 residential, 3 commercial, 3 industrial
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
- **Same series multiple times**: For comparison
- **Color-coded tags**: Each series has unique color
- **One-click removal**: × button on tags

## Aggregation

Four levels with button toggle:
- **Raw (15min)**: All 175,296 points per series
- **Daily**: Averaged to ~1,825 daily values
- **Monthly**: Averaged to 60 monthly values
- **Yearly**: Averaged to 5 yearly values

Active aggregation highlighted for visual feedback.

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

### Controls Panel
- Series selection dropdown
- Aggregation toggle buttons
- Clear visual feedback

### Loaded Series Panel
- Visual tags for each loaded series
- Color indicator matching chart lines
- One-click removal
- Series count display

### Chart Display
- Full-width responsive design
- Professional 9-color palette
- Shadow effects and rounded corners
- Smooth interactions
