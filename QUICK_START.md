# Quick Start

Get running in 5 minutes.

## 1. Check Prerequisites

```bash
python3 --version  # Need 3.12+
node --version     # Need 18+
uv --version       # Need 0.7+
```

Missing something? See [docs/SETUP.md](docs/SETUP.md)

## 2. Install

```bash
npm install
```

Python dependencies install automatically on first server run.

## 3. Start Servers

**Terminal 1:**
```bash
npm run server
```
Wait for: `Running on http://127.0.0.1:3001`

**Terminal 2:**
```bash
npm run dev
```
Wait for: `Local: http://localhost:5173`

## 4. Open Browser

Navigate to **http://localhost:5173**

## Try It

1. Change aggregation (Daily, Monthly, Yearly)
2. Add series from dropdown (12 available: Residential, Commercial, Industrial, Solar)
3. Zoom by dragging on chart
4. Remove series with × button
5. Try Solar series to see negative values (generation)

## Next Steps

- [docs/USAGE.md](docs/USAGE.md) - UI guide
- [docs/API.md](docs/API.md) - API reference
- [docs/SETUP.md](docs/SETUP.md#troubleshooting) - Troubleshooting

## Alternative Setup

Run both servers in one terminal:
```bash
npm run dev:all
```

---

**Full documentation:** [docs/README.md](docs/README.md)
