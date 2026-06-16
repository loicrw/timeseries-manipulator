# API Reference

Backend API documentation for Time Series Manipulator.

## Base URL

```
http://localhost:3001/api
```

## Authentication

No authentication required. All endpoints are publicly accessible.

## Endpoints

### GET /api/series

Returns list of available time series.

**Request:**
```http
GET /api/series HTTP/1.1
```

**Response:**
```json
{
  "series": [
    {
      "id": "residential_1",
      "name": "Residential 1",
      "file": "residential_1.csv",
      "color": "#FF6B6B"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:3001/api/series
```

---

### GET /api/base

Returns base series with optional aggregation.

**Query Parameters:**
- `aggregation` (optional): `raw` | `hourly` | `daily` | `monthly` | `yearly` (default: `raw`)

**Request:**
```http
GET /api/base?aggregation=daily HTTP/1.1
```

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2021-01-01T00:00:00.000Z",
      "energy_kwh": 523.45
    }
  ]
}
```

**Examples:**
```bash
curl "http://localhost:3001/api/base?aggregation=raw"
curl "http://localhost:3001/api/base?aggregation=hourly"
curl "http://localhost:3001/api/base?aggregation=daily"
curl "http://localhost:3001/api/base?aggregation=monthly"
curl "http://localhost:3001/api/base?aggregation=yearly"
```

---

### POST /api/running-total

Calculates running total (base + added series) with aggregation and multipliers.

**Request Body:**
- `addedSeriesFiles` (array of objects, required): Series configurations with multipliers
  - `file` (string): CSV filename
  - `positiveMultiplier` (number, optional): Multiplier for positive values (default: 1.0)
  - `negativeMultiplier` (number, optional): Multiplier for negative values (default: 1.0)
- `aggregation` (string, optional): Aggregation level (default: `raw`)

**Request:**
```http
POST /api/running-total HTTP/1.1
Content-Type: application/json

{
  "addedSeriesFiles": [
    {
      "file": "residential_1.csv",
      "positiveMultiplier": 1.5,
      "negativeMultiplier": 1.0
    },
    {
      "file": "solar_1.csv",
      "positiveMultiplier": 1.0,
      "negativeMultiplier": 0.8
    }
  ],
  "aggregation": "daily"
}
```

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2021-01-01T00:00:00.000Z",
      "energy_kwh": 673.12
    }
  ]
}
```

**Examples:**
```bash
# Add one series with default multipliers
curl -X POST http://localhost:3001/api/running-total \
  -H "Content-Type: application/json" \
  -d '{"addedSeriesFiles": [{"file": "residential_1.csv"}], "aggregation": "daily"}'

# Add series with custom multipliers
curl -X POST http://localhost:3001/api/running-total \
  -H "Content-Type: application/json" \
  -d '{"addedSeriesFiles": [{"file": "residential_1.csv", "positiveMultiplier": 1.5, "negativeMultiplier": 1.0}], "aggregation": "hourly"}'

# Add multiple series with different multipliers
curl -X POST http://localhost:3001/api/running-total \
  -H "Content-Type: application/json" \
  -d '{
    "addedSeriesFiles": [
      {"file": "residential_1.csv", "positiveMultiplier": 1.2, "negativeMultiplier": 1.0},
      {"file": "solar_1.csv", "positiveMultiplier": 1.0, "negativeMultiplier": 0.8}
    ],
    "aggregation": "monthly"
  }'
```

---

## Data Types

### TimeSeriesPoint

```typescript
interface TimeSeriesPoint {
  timestamp: string;   // ISO 8601 datetime
  energy_kwh: number;  // Energy consumption in kWh
}
```

### AggregationType

```typescript
type AggregationType = "raw" | "hourly" | "daily" | "monthly" | "yearly";
```

### SeriesConfig

```typescript
interface SeriesConfig {
  file: string;                  // CSV filename
  positiveMultiplier?: number;   // Multiplier for positive values (default: 1.0)
  negativeMultiplier?: number;   // Multiplier for negative values (default: 1.0)
}
```

## Error Handling

All errors return:
```json
{
  "error": "Error message"
}
```

**Common Errors:**

### File Not Found
```json
{
  "error": "FileNotFoundError: No such file or directory: 'public/data/missing.csv'"
}
```
Status: `500 Internal Server Error`

### Malformed JSON
```json
{
  "error": "400 Bad Request"
}
```
Status: `400 Bad Request`

## Caching

Backend implements in-memory caching:
- CSV files loaded once as Polars DataFrames
- Cache persists for server lifetime
- Restart server to clear cache

## CORS

API enables CORS for all origins. In production, restrict to specific origins:

```python
CORS(app, origins=["https://yourdomain.com"])
```

## Examples

### JavaScript/TypeScript

```typescript
// Fetch available series
const seriesRes = await fetch('http://localhost:3001/api/series');
const { series } = await seriesRes.json();

// Fetch base series
const baseRes = await fetch('http://localhost:3001/api/base?aggregation=daily');
const { data: baseData } = await baseRes.json();

// Calculate running total with multipliers
const totalRes = await fetch('http://localhost:3001/api/running-total', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    addedSeriesFiles: [
      {
        file: 'residential_1.csv',
        positiveMultiplier: 1.5,
        negativeMultiplier: 1.0
      }
    ],
    aggregation: 'hourly'
  })
});
const { data: totalData } = await totalRes.json();
```

### Python

```python
import requests

# Fetch available series
response = requests.get('http://localhost:3001/api/series')
series = response.json()['series']

# Fetch base series
response = requests.get('http://localhost:3001/api/base', 
                        params={'aggregation': 'daily'})
base_data = response.json()['data']

# Calculate running total with multipliers
response = requests.post('http://localhost:3001/api/running-total', json={
    'addedSeriesFiles': [
        {
            'file': 'residential_1.csv',
            'positiveMultiplier': 1.5,
            'negativeMultiplier': 1.0
        }
    ],
    'aggregation': 'hourly'
})
total_data = response.json()['data']
```

### curl

```bash
# Get series list
curl -s http://localhost:3001/api/series | jq '.series[].name'

# Get base series count
curl -s "http://localhost:3001/api/base?aggregation=daily" | jq '.data | length'

# Calculate running total with multipliers
curl -s -X POST http://localhost:3001/api/running-total \
  -H "Content-Type: application/json" \
  -d '{"addedSeriesFiles":[{"file":"residential_1.csv","positiveMultiplier":1.5,"negativeMultiplier":1.0}],"aggregation":"hourly"}' \
  | jq '.data[0:3]'
```

## Extending the API

### Adding New Endpoints

Edit `server-py/main.py`:

```python
@app.route("/api/stats", methods=["GET"])
def get_statistics():
    """Get statistics for all series."""
    df = load_dataframe("base.csv")
    stats = {
        "mean": df["energy_kwh"].mean(),
        "std": df["energy_kwh"].std(),
        "min": df["energy_kwh"].min(),
        "max": df["energy_kwh"].max(),
    }
    return jsonify(stats)
```

### Adding Query Parameters

```python
@app.route("/api/base", methods=["GET"])
def get_base_series():
    aggregation = request.args.get("aggregation", "raw")
    start_date = request.args.get("start_date")  # New param
    end_date = request.args.get("end_date")      # New param
    
    df = load_dataframe("base.csv")
    
    # Filter by date range
    if start_date:
        df = df.filter(pl.col("timestamp") >= start_date)
    if end_date:
        df = df.filter(pl.col("timestamp") <= end_date)
    
    aggregated_df = aggregate_dataframe(df, aggregation)
    return jsonify({"data": df_to_json(aggregated_df)})
```

## See Also

- [ARCHITECTURE.md](ARCHITECTURE.md) - Backend implementation details
- [SETUP.md](SETUP.md) - Installation and configuration
- [USAGE.md](USAGE.md) - Frontend usage guide
