# Usage Guide

## Quick Start

1. Start servers: `npm run server` and `npm run dev`
2. Open browser to `http://localhost:5173`
3. App automatically loads Residential 1 data

## Interface

### Controls Panel

#### Add Series Dropdown
- **Purpose**: Add any time series to chart
- **Options**: All 12 series (Residential 1-3, Commercial 1-3, Industrial 1-3, Solar 1-3)
- **Behavior**: Select to add immediately, can select same series multiple times

#### Left Sidebar - Added Series
- Fixed 320px width with scrollable content
- Shows all added series as expandable cards
- Each card displays:
  - **Color indicator**: Matches chart line color
  - **Series name**: E.g., "Residential 1", "Solar 2"
  - **Positive multiplier**: Input field to scale positive values (default: 1.0)
  - **Negative multiplier**: Input field to scale negative values (default: 1.0)
  - **Remove button (×)**: Click to remove series
- **Series counter**: "Added Series (3)" in header
- **Empty state**: Helpful message when no series added
- **Scrollable**: Handles 4+ series smoothly

#### Aggregation Buttons
- **Raw (15min)**: All 175,296 data points per series
- **Hourly**: ~43,824 hourly averages (1-hour intervals)
- **Daily**: ~1,825 daily averages
- **Monthly**: 60 monthly averages
- **Yearly**: 5 yearly averages

#### Year Filter Dropdown
- **All Years**: Show complete dataset (2021-2025)
- **2021-2025**: Filter to specific year only
- Works with all aggregation levels
- Instant client-side filtering

### Chart Area
Interactive Plotly chart with time on X-axis and energy (kWh) on Y-axis.

**Two traces displayed:**
1. **Base + Additions** (yellow line, #FFB81C): Combined series with all multipliers applied
2. **Base Load** (gray line, #64696C): Original base series for reference

Gray line draws on top of yellow line for better visibility.

## Interactive Features

### Zooming
- Click and drag to select rectangular area
- Double-click to reset to full view

### Panning
- Click pan button (hand icon) in toolbar
- Click and drag to move around chart

### Range Slider
- Drag handles below chart
- Adjust visible time window

### Hover
- Move mouse over chart to see exact values
- Shows values for all visible series at that timestamp

## Typical Workflows

### Exploring Daily Patterns
1. Base series loads automatically (gray line)
2. Keep "Raw (15min)" aggregation
3. Zoom to single week
4. Observe daily consumption cycles

### Scaling Series with Multipliers
1. Add "Residential 1" from dropdown
2. Set **Positive multiplier** to 1.5 (increase consumption by 50%)
3. Set **Negative multiplier** to 1.0 (no change)
4. Yellow line shows scaled result vs. gray baseline
5. Experiment with different multiplier values

### Comparing Building Types
1. Add Commercial 1 (multipliers: 1.0, 1.0)
2. Add Industrial 1 (multipliers: 1.0, 1.0)
3. Use "Hourly" or "Daily" aggregation
4. Notice different peak hours and magnitudes

### Solar Generation Analysis
1. Add Solar 1 series
2. Keep both multipliers at 1.0
3. Observe negative values (generation)
4. Set **Negative multiplier** to 0.5 to model 50% solar efficiency
5. Yellow line shows reduced generation impact

### Year-over-Year Comparison
1. Select "2021" from year filter
2. Note the pattern
3. Switch to "2022", "2023", etc.
4. Compare seasonal differences across years
5. Use "Daily" or "Monthly" aggregation

### Seasonal Analysis (All Years)
1. Set year filter to "All Years"
2. Switch to "Monthly" aggregation
3. View all 5 years
4. Observe seasonal variations
5. Compare responses to seasons

### Multi-Series Comparison
1. Add multiple series (unlimited)
2. Set different multipliers for each
3. Use "Yearly" aggregation for overview
4. Zoom into specific periods
5. Remove irrelevant series with × button in sidebar

### Net Energy Analysis with Scaling
1. Add residential/commercial series (multipliers: 1.0, 1.0)
2. Add solar series with:
   - **Positive multiplier**: 1.0 (no consumption scaling)
   - **Negative multiplier**: 1.2 (20% more generation)
3. Yellow line shows net consumption with scaled solar
4. Use "Daily" or "Hourly" aggregation to see patterns

## Data Characteristics

### Residential Series
- **Pattern**: Daily cycles with clear peaks
- **Morning Peak**: 7-9 AM
- **Evening Peak**: 6-9 PM
- **Weekends**: Higher baseline
- **Seasonal**: Higher in winter/summer
- **Variations**: 1 (baseline), 2 (-10%), 3 (+10%)

### Commercial Series
- **Pattern**: Strong weekday/weekend difference
- **Business Hours**: 8 AM - 6 PM weekdays
- **Lunch Dip**: 12-1 PM
- **Weekends**: Minimal usage
- **Seasonal**: Higher in summer
- **Variations**: 1 (baseline), 2 (-10%), 3 (+10%)

### Industrial Series
- **Pattern**: Constant high load
- **Baseline**: ~150 kWh continuous
- **Shutdowns**: Random maintenance (~7/year)
- **Recovery**: Gradual return after shutdown
- **Seasonal**: Minimal variation
- **Variations**: 1 (baseline), 2 (-10%), 3 (+10%)

### Solar Series
- **Pattern**: Daytime generation only (negative values)
- **Generation Hours**: 6 AM - 6 PM
- **Peak**: Solar noon (12 PM)
- **Weather**: Variable cloud cover reduces generation
- **Seasonal**: Higher in summer, lower in winter
- **Variations**: 1 (baseline), 2 (-10%), 3 (+10%)

## Tips

1. **Performance**: Raw view responsive even with 175k points (WebGL accelerated)
2. **Unlimited series**: Add/remove as many series as needed
3. **Multiplier comparison**: Add same series twice with different multipliers to compare scenarios
4. **Multi-scale analysis**: Switch aggregations to see patterns at different scales
5. **Export charts**: Use Plotly camera icon to save charts as PNG
6. **Reset zoom**: Double-click chart if lost in zoom levels
7. **Trend analysis**: Use "Yearly" aggregation for 5-year trends
8. **Visual matching**: Sidebar color indicators match chart line colors
9. **Solar modeling**: Use negative multipliers < 1.0 to model reduced solar generation
10. **Load forecasting**: Use positive multipliers > 1.0 to model increased demand
11. **Year filtering**: Combine year filter with hourly aggregation for detailed single-year analysis
12. **Color coding**: Yellow (#FFB81C) indicates combined result, gray (#64696C) shows baseline

## Troubleshooting

### Chart not loading
- Check browser console for errors
- Ensure backend is running (`npm run server`)
- Verify CSV files exist in `public/data/`
- Regenerate data: `python3 generate_data_simple.py`

### Can't add more series
- No limit on series count
- Check browser console for errors
- Dropdown resets automatically after selection

### Series removed by accident
- Simply select it again from dropdown
- All series can be re-added unlimited times
