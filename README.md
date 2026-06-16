# Time Series Manipulator

High-performance web app for visualizing large time series datasets (175k+ points per series). Python + Polars backend for fast data processing, React frontend with WebGL-accelerated rendering.

## 🚀 Quick Start

**Want to get started in 5 minutes?** → See [QUICK_START.md](QUICK_START.md)

### Prerequisites

- **Python 3.12+** (check: `python3 --version`)
- **Node.js 18+** (check: `node --version`)
- **uv** package manager (check: `uv --version`)

> **Detailed setup guide:** [docs/SETUP.md](docs/SETUP.md)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd timeseries-manipulator

# Install frontend dependencies
npm install

# Python dependencies are auto-installed by uv when you start the server
```

### Running the Application

**Terminal 1 - Start Python Backend:**
```bash
npm run server
```
Wait for: `🚀 Polars-powered API Server`

**Terminal 2 - Start React Frontend:**
```bash
npm run dev
```
Wait for: `➜ Local: http://localhost:5173`

**Open your browser:** http://localhost:5173

### Verify Setup

```bash
./test-setup.sh
```

This checks all prerequisites, dependencies, and running services.

## Features

- **175,296 data points** per series, 9 series total (5 years, 15-min intervals)
- **Real-time aggregation**: Raw → daily → monthly → yearly
- **Add/remove unlimited series** dynamically
- **Interactive WebGL charts**: Zoom, pan, hover with Plotly.js
- **Python + Polars backend**: Fast DataFrame operations
- **React frontend**: Modern TypeScript UI
- **9 pre-generated datasets**: Residential, Commercial, Industrial patterns

## Usage

1. Base series auto-loads on startup
2. Add series from dropdown
3. Remove with × button on series tags
4. Change aggregation: Raw/Daily/Monthly/Yearly
5. Zoom: Click and drag on chart
6. Reset: Double-click chart

Full guide: [docs/USAGE.md](docs/USAGE.md)

## 🏗️ Architecture

```
┌──────────────────┐
│  React Frontend  │  Port 5173
│  (Vite + TS)     │  WebGL rendering
└────────┬─────────┘
         │ API calls (HTTP)
         ▼
┌──────────────────┐
│ Python Backend   │  Port 3001
│ (Flask + Polars) │  DataFrame operations
└────────┬─────────┘
         │ Reads
         ▼
┌──────────────────┐
│   CSV Files      │  public/data/
│   (175k pts ea)  │  9 × 4.4MB
└──────────────────┘
```

**Why Polars?**
- Rust-based with SIMD vectorization
- Multi-threaded by default
- Columnar Apache Arrow storage
- Lazy evaluation with query optimization

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 🛠️ Development

### Project Structure

```
timeseries-manipulator/
├── docs/                      # 📚 Documentation
│   ├── SETUP.md              # Detailed setup guide
│   ├── API.md                # API reference
│   ├── ARCHITECTURE.md       # System design
│   ├── PERFORMANCE.md        # Benchmarks
│   └── USAGE.md              # User guide
├── server-py/                # 🐍 Python backend
│   ├── main.py               # Flask + Polars API
│   └── pyproject.toml        # Dependencies
├── src/                      # ⚛️ React frontend
│   ├── App.tsx               # Main component
│   └── utils/                # Helpers
├── public/data/              # 📁 CSV datasets
└── package.json              # Node scripts
```

### Scripts

```bash
npm run dev          # Start frontend (Vite)
npm run server       # Start backend (Python + Polars)
npm run dev:all      # Start both (background)
npm run server:node  # Fallback: Node.js backend (slower)
npm run build        # Build for production
```

### Adding Dependencies

**Backend (Python):**
```bash
cd server-py
uv add package-name
```

**Frontend (Node):**
```bash
npm install package-name
```

## 📚 Documentation

### Quick Links

- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Complete technical overview
- **[docs/](docs/)** - Full documentation library

### Comprehensive Guides

Detailed documentation in the `docs/` folder:

- **[Setup Guide](docs/SETUP.md)** - Installation, troubleshooting, requirements
- **[Usage Guide](docs/USAGE.md)** - UI features, workflows, tips
- **[API Reference](docs/API.md)** - Endpoints, request/response formats, examples
- **[Architecture](docs/ARCHITECTURE.md)** - System design, data flow, Polars details
- **[Performance](docs/PERFORMANCE.md)** - Benchmarks, comparisons, optimization
- **[Features](docs/FEATURES.md)** - Complete feature list
- **[Changelog](docs/CHANGELOG.md)** - Version history

📋 **Documentation index:** [docs/README.md](docs/README.md)

## API

Backend runs on **http://localhost:3001** with 3 endpoints:
- `GET /api/series` - List available series
- `GET /api/base?aggregation={level}` - Get base series
- `POST /api/running-total` - Calculate combined series

Full reference: [docs/API.md](docs/API.md)

## 🧪 Data Generation

Regenerate sample data (optional):

```bash
python3 generate_data_simple.py
```

Creates 9 CSV files with 5 years of 15-minute interval data:
- `base.csv` - Base load (500 kWh average)
- `residential_1/2/3.csv` - Residential patterns
- `commercial_1/2/3.csv` - Commercial patterns
- `industrial_1/2/3.csv` - Industrial patterns

## Troubleshooting

See [docs/SETUP.md](docs/SETUP.md#troubleshooting) for common issues:
- Port conflicts
- Python/uv installation
- Dependency problems
- Performance tuning

## Tech Stack

**Backend:** Python 3.13, uv, Polars, Flask  
**Frontend:** React 18, TypeScript, Vite, Plotly.js

## License

MIT License

---

For questions, see [docs/](docs/) or open an issue.
