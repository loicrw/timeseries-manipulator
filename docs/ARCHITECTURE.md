# Architecture

## Overview

Python backend powered by Polars handles all data loading, aggregation, and series operations. React frontend displays results via WebGL-accelerated charts.

## System Architecture

```
┌─────────────┐      HTTP API      ┌─────────────┐
│   React     │ ─────────────────> │   Flask     │
│  Frontend   │                     │   Server    │
│  (Browser)  │ <───────────────── │  (Python)   │
└─────────────┘   JSON responses   └─────────────┘
                                           │
                                           │ Polars DataFrames
                                           ▼
                                    ┌─────────────┐
                                    │  CSV Files  │
                                    │ (175k pts)  │
                                    └─────────────┘
```

## Python Backend (Port 3001)

### Polars Optimizations

1. **Lazy Evaluation**: Optimizes query plans before execution
2. **Columnar Storage**: Apache Arrow format for cache efficiency
3. **SIMD Vectorization**: Rust-based operations use CPU vector instructions
4. **Multi-threading**: Automatically parallelizes across cores
5. **Zero-copy Operations**: Minimizes memory allocations
6. **Fast CSV Reading**: Optimized CSV parser
7. **Optimized Joins**: Hash-based joins with O(n+m) complexity
8. **DataFrame Caching**: Loaded CSVs cached in memory

### API Endpoints

#### `GET /api/series`
Returns list of available time series.

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

#### `GET /api/base?aggregation={level}`
Returns base series with specified aggregation.

**Parameters:**
- `aggregation`: `raw` | `daily` | `monthly` | `yearly`

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

#### `POST /api/running-total`
Calculates running total (base + all added series).

**Request Body:**
```json
{
  "addedSeriesFiles": ["residential_1.csv"],
  "aggregation": "daily"
}
```

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2021-01-01T00:00:00.000Z",
      "energy_kwh": 623.45
    }
  ]
}
```

## React Frontend

### Data Flow

1. **On Mount**: Fetch available series list
2. **On Change**: 
   - Fetch base series from `/api/base`
   - If series added, fetch running total from `/api/running-total`
3. **Plotting**: Use received data with Plotly (WebGL)

### Changes from Client-Side Processing

**Before:**
- Loaded CSV in browser
- JavaScript aggregation
- High memory (multiple 175k arrays)

**After:**
- API calls to backend
- Receives pre-aggregated data
- Low memory (only display data)

## Performance Benefits

### Why Polars is Faster
- Rust-based vectorized operations
- Columnar Apache Arrow format
- Multi-core processing
- Optimized hash joins

### Server-Side Processing
- DataFrame caching (load once)
- Query optimization
- Lazy evaluation
- Bulk operations

### Client-Side Benefits
- Reduced memory footprint
- Faster rendering
- Non-blocking API calls
- Instant aggregation switching

## Running the App

### Development

```bash
# Terminal 1 - Python backend
npm run server

# Terminal 2 - React frontend  
npm run dev

# Or combined
npm run dev:all
```

### Requirements
- Python 3.12+ with uv
- Node.js 18+
- Dependencies auto-installed by uv

## File Structure

```
timeseries-manipulator/
├── server-py/             # Python + Polars backend (ACTIVE)
│   ├── main.py            # Flask API with Polars operations
│   ├── pyproject.toml     # uv project config
│   └── .venv/             # Virtual environment
├── server/                # Node.js backup (unused)
├── src/                   # React frontend
│   ├── App.tsx            # API client
│   └── types.ts
├── public/data/           # CSV files (9 series, 175k pts each)
└── package.json
```

## Future Optimizations

Potential improvements:
1. Streaming responses for raw data
2. WebSocket connections for real-time updates
3. Pre-aggregated file caching on disk
4. Compression (gzip) for API responses
5. Database storage (SQLite/PostgreSQL)
6. Worker threads for parallel processing

## Comparison: What We Tried

| Approach | Result |
|----------|--------|
| useMemo caching | Helped, but still slow with 175k points |
| WebGL rendering | Improved chart rendering |
| Running total pattern | Reduced memory, aggregation still slow |
| Node.js + Polars | Requires Node 20+, platform binaries missing |
| Optimized Node.js backend | Good - faster than client-side |
| **Python + Polars + uv** | **BEST - fastest, cleanest code** |

## Key Insight

Move computation to where it's fastest:
- **Browser**: Great for rendering, poor for data processing
- **Python + Polars**: Excellent for data processing
- **Separation of concerns**: Each layer does what it's best at

By processing 175k points server-side and sending only aggregated results to the browser, we get fast computation + smooth UI.
