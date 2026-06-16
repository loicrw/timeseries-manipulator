# Time Series Manipulator - Features

## Implemented Features

### 1. Base Time Series App
- Nine sample energy consumption time series generated with Python (3 versions of each type)
- Data stored as CSV files in `public/data/`:
  - `residential_1.csv`, `residential_2.csv`, `residential_3.csv` - Residential buildings with different scales
  - `commercial_1.csv`, `commercial_2.csv`, `commercial_3.csv` - Commercial buildings with varying intensities
  - `industrial_1.csv`, `industrial_2.csv`, `industrial_3.csv` - Industrial facilities with different baselines
- 175,296 data points per series (15-minute intervals for 5 years: 2021-2025)

### 2. Auto-load Base Series
- Residential 1 series loads automatically when the app opens
- No user action required to see initial visualization

### 3. Interactive Chart with Plotly
- **Zoom**: Click and drag on the chart to zoom into a specific time range
- **Pan**: Drag the chart or use the range slider at the bottom
- **Reset**: Double-click the chart to reset to full view
- **Hover**: Unified hover mode shows all series values at a given time
- **Range slider**: Built-in range selector below the main chart
- **Toolbar**: Access to various interaction modes (zoom, pan, reset, etc.)

### 4. Add Multiple Time Series
- Dropdown menu to add any available time series
- **Can select the same series multiple times** for comparison across time periods
- **All 9 series available**: Residential 1-3, Commercial 1-3, Industrial 1-3
- **Series management**:
  - Each loaded series appears as a colored tag
  - Click × button to remove any series
  - Color-coded for easy identification
  - Shows count of loaded series

### 5. Time Aggregation Toggle
Four aggregation levels with intuitive button interface:
- **Raw (15min)**: Original 15-minute interval data
- **Daily**: Averaged to daily values
- **Monthly**: Averaged to monthly values
- **Yearly**: Averaged to yearly values

Active aggregation is highlighted in green for clear visual feedback.

## Technical Implementation

### Frontend Stack
- React 18 with TypeScript
- Vite for fast development and building
- Plotly.js for interactive charts
- CSS for styling (no external UI libraries)

### Data Processing
- Client-side aggregation using JavaScript
- Efficient timestamp-based grouping
- Averaging algorithm for different time periods

### Data Generation
- Python script with no external dependencies
- Realistic patterns:
  - Sine waves for daily/seasonal cycles
  - Peak hour modeling
  - Random noise for realism
  - Maintenance shutdown periods for industrial

## File Structure

```
timeseries-manipulator/
├── public/
│   └── data/
│       ├── residential.csv
│       ├── commercial.csv
│       └── industrial.csv
├── src/
│   ├── utils/
│   │   ├── dataLoader.ts      # CSV loading
│   │   └── aggregation.ts     # Time aggregation logic
│   ├── App.tsx                # Main component
│   ├── App.css                # Styling
│   ├── types.ts               # TypeScript types
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
├── generate_data_simple.py    # Data generation script
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## User Interface

### Controls Panel
Clean, card-based design with:
- Series selection dropdown (add unlimited series)
- Aggregation toggle buttons
- Clear visual feedback for active selections

### Loaded Series Panel
- Visual tags for each loaded series
- Color indicator matching chart lines
- One-click removal with × button
- Series count display

### Chart Display
- Full-width responsive design
- White background for readability
- Professional color palette with 9 distinct colors
- Shadow effects for depth
- Rounded corners for modern look

## Performance
- Handles 175,296 data points per series (5 years of 15-min data)
- Client-side aggregation processes millions of points efficiently
- Plotly handles zooming/panning smoothly even with multiple series
- Series loaded on-demand (only when selected)
- Can display multiple series simultaneously without performance degradation
