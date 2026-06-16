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

#### Loaded Series Panel
- Shows all loaded series as colored tags
- Each tag displays color indicator and series name
- Click × to remove any series

#### Aggregation Buttons
- **Raw (15min)**: All 175,296 data points per series
- **Daily**: ~1,825 daily averages
- **Monthly**: 60 monthly averages
- **Yearly**: 5 yearly averages

### Chart Area
Interactive Plotly chart with time on X-axis and energy (kWh) on Y-axis.

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
1. Start with Residential 1 (auto-loaded)
2. Keep "Raw (15min)" aggregation
3. Zoom to single week
4. Observe daily consumption cycles

### Comparing Building Types
1. Add Commercial 1 from dropdown
2. Add Industrial 1 from dropdown
3. Use "Raw" or "Daily" aggregation
4. Notice different peak hours and magnitudes

### Comparing Variations
1. Add all 3 residential series
2. Switch to "Daily" aggregation
3. Compare different scales and patterns

### Seasonal Analysis
1. Switch to "Monthly" aggregation
2. View all 5 years
3. Observe seasonal variations
4. Compare responses to seasons

### Multi-Series Comparison
1. Add multiple series (up to 12)
2. Use "Yearly" aggregation for overview
3. Zoom into specific periods
4. Remove irrelevant series with × button

### Net Energy Analysis
1. Add residential/commercial/industrial series
2. Add solar series (negative = generation)
3. Observe net consumption (consumption - generation)
4. Use "Daily" aggregation to see daily patterns

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

1. Raw view responsive even with 175k points
2. Add/remove as many series as needed
3. Add same series twice to compare different time periods
4. Switch aggregations to see patterns at different scales
5. Use Plotly camera icon to save charts as PNG
6. Double-click if lost in zoom levels
7. Use "Yearly" for 5-year trends
8. Series tags match chart line colors

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
