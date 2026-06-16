# Setup Guide

Installation and configuration guide.

## System Requirements

**Minimum:**
- Python 3.12+
- Node.js 18+
- RAM: 4GB
- Disk: ~500MB

**Recommended:**
- Python 3.13+
- Node.js 20+
- RAM: 16GB
- Multi-core CPU (Polars uses multiple threads)

**Check versions:**
```bash
python3 --version  # Need 3.12+
node --version     # Need v18+
uv --version       # Need 0.7+
```

## Installation

### 1. Navigate to Project
```bash
cd timeseries-manipulator
```

### 2. Install uv (if needed)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv --version  # Verify
```

### 3. Install Frontend Dependencies
```bash
npm install  # Installs React, Vite, Plotly.js, etc.
```

### 4. Python Dependencies
Auto-installed by uv on first server run. To manually install:
```bash
cd server-py && uv sync && cd ..
```

### 5. Sample Data
Already included in `public/data/`. To regenerate:
```bash
python3 generate_data_simple.py
```

## Running

### Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
npm run server
```
Wait for: `Running on http://127.0.0.1:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Wait for: `Local: http://localhost:5173`

**Open:** http://localhost:5173

### Combined (Background)
```bash
npm run dev:all

# To stop:
pkill -f "main.py"
pkill -f "vite"
```

### Node.js Fallback
If Python fails:
```bash
npm run server:node  # Terminal 1
npm run dev          # Terminal 2
```

## Configuration

### Change Backend Port

Edit `server-py/main.py`:

```python
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3002)  # Change from 3001
```

Then update `src/App.tsx`:

```typescript
const API_BASE = 'http://localhost:3002/api';  // Change from 3001
```

### Change Frontend Port

Vite automatically finds an available port. To force a specific port:

```bash
npm run dev -- --port 5174
```

Or edit `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  }
})
```

### Enable/Disable CORS

Edit `server-py/main.py`:

```python
# Allow all origins (current)
CORS(app)

# Restrict to specific origin
CORS(app, origins=["http://localhost:5173"])

# Disable CORS (if backend and frontend on same domain)
# Just remove the CORS(app) line
```

### Adjust Caching

Edit `server-py/main.py`:

```python
# Current: cache all loaded DataFrames
df_cache: Dict[str, pl.DataFrame] = {}

# Disable caching (reload CSVs every time)
def load_dataframe(filename: str) -> pl.DataFrame:
    filepath = DATA_DIR / filename
    df = pl.read_csv(...)
    return df  # Don't cache
```

## Troubleshooting

### Port Already in Use

**Error:**
```
Address already in use
```

**Solution:**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill it
lsof -ti:3001 | xargs kill -9

# Or change port (see Configuration above)
```

### Python Version Too Old

**Error:**
```
uv requires Python 3.12+
```

**Solution:**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3.13
python3.13 --version
```

**macOS:**
```bash
brew install python@3.13
python3.13 --version
```

Update shebang in scripts to use `python3.13`.

### uv Command Not Found

**Error:**
```
bash: uv: command not found
```

**Solution:**

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Add to PATH (if needed)
export PATH="$HOME/.local/bin:$PATH"

# Or restart terminal
```

**Verify:**
```bash
uv --version
```

### Module Not Found: polars

**Error:**
```
ModuleNotFoundError: No module named 'polars'
```

**Solution:**

```bash
cd server-py
uv sync
cd ..

# Then restart server
npm run server
```

### Node Modules Missing

**Error:**
```
Cannot find module 'react'
```

**Solution:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### CSV Files Not Found

**Error:**
```
FileNotFoundError: [Errno 2] No such file or directory: 'public/data/base.csv'
```

**Solution:**

```bash
# Regenerate data
python3 generate_data_simple.py

# Verify files
ls -lh public/data/*.csv
# Should see 10 files (base.csv + 9 series)
```

### Frontend Shows "Loading..." Forever

**Symptoms:**
- UI shows "Loading data..." indefinitely
- No errors in browser console

**Diagnosis:**

1. Check if backend is running:
```bash
curl http://localhost:3001/api/series
# Should return JSON with series list
```

2. Check browser console for errors (F12)

**Solution:**

```bash
# Restart backend
pkill -f "main.py"
npm run server

# Check CORS is enabled in server-py/main.py
# Should have: CORS(app)
```

### Performance Issues

**Symptoms:** Slow aggregations, high memory, laggy UI

**Solutions:**
1. Use Daily/Monthly instead of Raw with multiple series
2. Check backend running: `ps aux | grep main.py`
3. Restart servers: `pkill -f "main.py" && pkill -f "vite"`

### Browser Compatibility

**Supported:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+  
**Older browsers:** May lack WebGL or ES6 features

### Permission Errors

```bash
chmod +x generate_data_simple.py
sudo chown -R $USER ~/.npm  # If installing globally
```

## Advanced Setup

### Hot Reload
**Backend:** Edit `server-py/main.py` → auto-restarts  
**Frontend:** Edit `src/App.tsx` → instant update (Vite HMR)

### Production Build
```bash
npm run build        # Output in dist/
npm run preview      # Test build

# Production backend
cd server-py
uv add gunicorn
uv run gunicorn -w 4 -b 0.0.0.0:3001 main:app
```

### Docker (Optional)
```dockerfile
FROM python:3.13-slim
RUN apt-get update && apt-get install -y nodejs npm
WORKDIR /app
COPY . .
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"
RUN npm install && cd server-py && uv sync
EXPOSE 3001 5173
CMD ["sh", "-c", "npm run dev:all"]
```

```bash
docker build -t timeseries-app .
docker run -p 3001:3001 -p 5173:5173 timeseries-app
```

### Environment Variables
```bash
# .env file
FLASK_PORT=3001
FLASK_DEBUG=true
VITE_API_URL=http://localhost:3001/api
```

### Testing
```bash
npm test  # Frontend (after adding Vitest)
cd server-py && uv add pytest && uv run pytest  # Backend
```

## Next Steps

1. [USAGE.md](USAGE.md) - UI guide
2. [API.md](API.md) - API reference
3. [ARCHITECTURE.md](ARCHITECTURE.md) - System design

## Getting Help

1. Check browser console (F12) and backend terminal
2. Verify services running:
   ```bash
   curl http://localhost:3001/api/series
   curl http://localhost:5173
   ```
3. Open GitHub issue with error message, versions, OS

---

Setup complete! See [USAGE.md](USAGE.md) for usage guide.
