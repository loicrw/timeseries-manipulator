# Time Series Manipulator - Usage Guide

## Quick Start

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. The app will automatically load the Residential 1 energy consumption data

## Interface Overview

### Header
- Title: "Time Series Manipulator"
- Clean, centered layout

### Controls Panel
White card with two main control groups:

#### 1. Add Series Dropdown
- **Purpose**: Add any time series to the chart
- **Options**: All 9 series (Residential 1-3, Commercial 1-3, Industrial 1-3)
- **Behavior**: 
  - Select a series to add it immediately
  - Can select the same series multiple times
  - Dropdown resets after selection
- **Effect**: Selected series appears as a colored line on the chart

#### 2. Loaded Series Panel
- Shows all currently loaded series as colored tags
- Each tag displays:
  - Color indicator (matches chart line)
  - Series name
  - Remove button (×)
- Click × to remove any series from the chart

#### 3. Aggregation Buttons
- **Raw (15min)**: Shows all 175,296 data points per series (5 years, recommended for detailed analysis)
- **Daily**: Aggregates to ~1,825 daily averages (good for weekly/monthly patterns)
- **Monthly**: Aggregates to 60 monthly averages (good for seasonal trends across years)
- **Yearly**: Aggregates to 5 yearly averages (useful for year-over-year comparisons)

### Chart Area
Large, interactive Plotly chart with:
- X-axis: Time
- Y-axis: Energy Consumption (kWh)
- Range slider at bottom for quick navigation

## Interactive Features

### Zooming
1. **Box Zoom** (default):
   - Click and drag to select a rectangular area
   - Chart zooms into the selected time range
   
2. **Double-click to reset**: Returns to full view

### Panning
1. Click the "Pan" button in the toolbar (hand icon)
2. Click and drag to move around the chart
3. Useful after zooming in

### Range Slider
- Drag the handles on the range slider below the chart
- Adjust the visible time window without losing context
- Small preview of entire dataset

### Hover
- Move mouse over chart to see exact values
- Shows values for all visible series at that timestamp
- Vertical line appears at cursor position

## Understanding the Visualization

### Colors
The app uses 9 distinct colors that automatically cycle:
- Color 1: Blue (#2196F3)
- Color 2: Orange (#FF9800)
- Color 3: Green (#4CAF50)
- Color 4: Pink (#E91E63)
- Color 5: Purple (#9C27B0)
- Color 6: Cyan (#00BCD4)
- Color 7: Deep Orange (#FF5722)
- Color 8: Brown (#795548)
- Color 9: Blue Grey (#607D8B)

Each series gets the next available color in sequence.

## Typical Workflows

### 1. Exploring Daily Patterns
1. Start with Residential 1 (auto-loaded)
2. Keep aggregation on "Raw (15min)"
3. Use box zoom to select a single week
4. Observe daily consumption cycles
5. Look for morning/evening peaks in residential data

### 2. Comparing Building Types
1. Add "Commercial 1" from dropdown
2. Add "Industrial 1" from dropdown
3. Keep "Raw (15min)" or switch to "Daily"
4. Notice:
   - Commercial has strong weekday pattern
   - Residential is more consistent
   - Industrial has constant baseline with shutdowns
   - Different peak hours and magnitudes

### 3. Comparing Variations
1. Add all 3 residential series (Residential 1, 2, 3)
2. Switch to "Daily" aggregation
3. Compare the different scales and patterns
4. Notice how variation affects overall consumption

### 4. Seasonal Analysis Across Years
1. Switch to "Monthly" aggregation
2. View all 5 years
3. Observe seasonal variations across multiple years
4. Compare how different building types respond to seasons
5. Look for year-over-year trends

### 5. Multi-Series Comparison
1. Add multiple series (up to 9 for all colors)
2. Use "Yearly" aggregation for overview
3. Zoom into specific time periods
4. Remove series that aren't relevant with × button
5. Add different series to test new comparisons

## Data Characteristics

### Residential Series (1, 2, 3)
- **Pattern**: Daily cycles with clear peaks
- **Morning Peak**: 7-9 AM (breakfast, getting ready)
- **Evening Peak**: 6-9 PM (cooking, lighting, entertainment)
- **Weekends**: Slightly higher baseline (people home all day)
- **Seasonal**: Higher in winter/summer (heating/cooling)
- **Variations**:
  - Residential 1: Baseline scale (avg ~57 kWh)
  - Residential 2: 10% lower scale (avg ~52 kWh)
  - Residential 3: 10% higher scale (avg ~63 kWh)

### Commercial Series (1, 2, 3)
- **Pattern**: Strong weekday/weekend difference
- **Business Hours**: 8 AM - 6 PM weekdays
- **Lunch Dip**: Reduced usage 12-1 PM
- **Weekends**: Minimal usage (security/emergency systems only)
- **Seasonal**: Higher in summer (air conditioning dominant)
- **Variations**:
  - Commercial 1: Baseline scale (avg ~46 kWh)
  - Commercial 2: 10% lower scale (avg ~41 kWh)
  - Commercial 3: 10% higher scale (avg ~50 kWh)

### Industrial Series (1, 2, 3)
- **Pattern**: Constant high load
- **Baseline**: ~150 kWh continuous
- **Shutdowns**: Random maintenance periods (~35 over 5 years, 7/year)
- **Recovery**: Gradual return to normal after shutdown
- **Seasonal**: Minimal variation (climate-controlled)
- **Variations**:
  - Industrial 1: Baseline scale (avg ~149 kWh)
  - Industrial 2: 10% lower scale (avg ~134 kWh)
  - Industrial 3: 10% higher scale (avg ~163 kWh)

## Tips and Tricks

1. **Performance**: Raw view is responsive even with 175k points per series
2. **Multiple series**: Add as many series as you need, remove ones you don't
3. **Same series twice**: Useful for comparing different time periods via zoom
4. **Analysis**: Switch aggregations to see patterns at different scales
5. **Export**: Use Plotly's camera icon to save charts as PNG
6. **Reset**: Double-click if you get lost in the zoom levels
7. **Long-term trends**: Use "Yearly" aggregation to see 5-year trends
8. **Color matching**: Series tags show the same color as chart lines

## Troubleshooting

### Chart not loading
- Check browser console for errors
- Ensure data files exist in `public/data/` (9 CSV files)
- Try refreshing the page
- Regenerate data if files are missing: `python3 generate_data_simple.py`

### Can't add more series
- No limit on number of series
- If dropdown seems stuck, it resets automatically after selection
- Check browser console for loading errors

### Aggregation seems slow
- First aggregation of 175k points takes a moment
- Subsequent changes use cached data and are faster
- Consider using Daily/Monthly for faster interaction with multiple series

### Series removed by accident
- Simply select it again from the dropdown
- All series can be re-added unlimited times

### Data looks wrong
- Regenerate data: `python3 generate_data_simple.py`
- This creates all 9 CSV files with 5 years of data each
- Check CSV format matches expected structure (timestamp,energy_kwh)
- Ensure timestamps are valid ISO 8601 format
