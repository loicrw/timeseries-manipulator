# Time Series Manipulator

A React-based web application for visualizing and analyzing time series data, specifically focused on energy consumption patterns.

## Features

- **Auto-load base series**: Automatically loads residential energy data on startup
- **Interactive Plotly charts**: Full support for zoom, pan, drag, and time series navigation
- **Multiple series comparison**: Add unlimited time series via dropdown, select same series multiple times
- **Series management**: Remove individual series with one click
- **Time aggregation**: Toggle between raw (15min), daily, monthly, and yearly views
- **Sample datasets**: Nine pre-generated energy consumption time series (3 versions each, 5 years of data):
  - Residential 1, 2, 3: Daily patterns with morning/evening peaks, different scales
  - Commercial 1, 2, 3: Business hour usage patterns, varying intensities
  - Industrial 1, 2, 3: Constant load with maintenance shutdowns, different baselines

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate sample data** (already done):
   ```bash
   python3 generate_data_simple.py
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: Navigate to `http://localhost:5173`

## Usage

- **Base series**: Residential 1 series loads automatically on startup
- **Add series**: Use the dropdown to add any series (can select the same series multiple times)
- **Remove series**: Click the × button on any series tag to remove it from the chart
- **Zoom**: Click and drag on the chart to zoom into a time range
- **Pan**: Use the pan tool in the toolbar or drag the range slider at the bottom
- **Reset**: Double-click the chart to reset the view
- **Aggregation**: Click the aggregation buttons to change time granularity

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Visualization**: Plotly.js
- **Data**: CSV files with 15-minute interval energy consumption data
- **Data Generation**: Python (no dependencies required for the simple version)

## Data Format

CSV files are stored in `public/data/` with the following format:
```csv
timestamp,energy_kwh
2021-01-01T00:00:00,52.34
2021-01-01T00:15:00,48.91
...
```

Each file contains 5 years of data (2021-2025) at 15-minute intervals (175,296 data points per file).