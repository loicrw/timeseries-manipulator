# Documentation Index

Complete documentation for Time Series Manipulator.

## Quick Links

### For Users
1. [SETUP.md](SETUP.md) - Installation and running
2. [USAGE.md](USAGE.md) - How to use the UI
3. [FEATURES.md](FEATURES.md) - What the app can do

### For Developers
1. [ARCHITECTURE.md](ARCHITECTURE.md) - System design
2. [API.md](API.md) - Backend endpoints
3. [PERFORMANCE.md](PERFORMANCE.md) - Why Polars is faster

### Reference
1. [CHANGELOG.md](CHANGELOG.md) - Version history

## Documentation Files

### [SETUP.md](SETUP.md)
Complete installation guide covering:
- Prerequisites (Python 3.12+, Node.js 18+, uv)
- Installation steps
- Running backend and frontend
- Configuration options
- Troubleshooting common issues

**Read this if:** Setting up for the first time or encountering issues.

### [USAGE.md](USAGE.md)
User guide covering:
- Interface overview
- Interactive features (zoom, pan, hover)
- Data exploration workflows
- Tips and tricks

**Read this if:** Learning how to use the application.

### [API.md](API.md)
API reference covering:
- All 3 endpoints with documentation
- Request/response formats
- Error handling
- Examples in JavaScript, Python, curl

**Read this if:** Integrating with backend or building custom clients.

### [ARCHITECTURE.md](ARCHITECTURE.md)
System design covering:
- Architecture diagram
- Python + Polars backend implementation
- React frontend implementation
- Data flow
- Polars optimizations

**Read this if:** Understanding how the system works.

### [PERFORMANCE.md](PERFORMANCE.md)
Performance analysis covering:
- Code comparisons (JavaScript vs Polars)
- Why Polars is faster
- When to use each approach

**Read this if:** Curious about performance or considering Polars.

### [FEATURES.md](FEATURES.md)
Feature list covering:
- Implemented features
- Technical capabilities
- Data characteristics

**Read this if:** Overview of what the app can do.

### [CHANGELOG.md](CHANGELOG.md)
Version history covering:
- Version 3.2: Multipliers, hourly aggregation, year filtering, UI enhancements
- Version 3.1: Solar series addition
- Version 3.0: Polars backend migration
- Version 2.0: Multi-series support
- Version 1.0: Initial release

**Read this if:** What's changed between versions.

## Common Tasks

**Install and run** → [SETUP.md](SETUP.md)  
**Learn the UI** → [USAGE.md](USAGE.md)  
**Understand architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)  
**Call the API** → [API.md](API.md)  
**Fix installation error** → [SETUP.md#troubleshooting](SETUP.md#troubleshooting)  
**See performance comparison** → [PERFORMANCE.md](PERFORMANCE.md)  
**Check features** → [FEATURES.md](FEATURES.md)  
**Recent changes** → [CHANGELOG.md](CHANGELOG.md)

## Architecture Overview

```
CSV Files → Polars DataFrames → Flask API → React Frontend → Plotly Chart
```

Detailed explanation in [ARCHITECTURE.md](ARCHITECTURE.md).

## Getting Help

1. Check this index for relevant topics
2. Troubleshooting: [SETUP.md#troubleshooting](SETUP.md#troubleshooting)
3. API errors: [API.md#error-handling](API.md#error-handling)
4. GitHub Issues if docs don't help

## External Resources

### Polars
- [Documentation](https://pola.rs/)
- [Python API](https://pola-rs.github.io/polars/py-polars/html/reference/)

### Flask
- [Documentation](https://flask.palletsprojects.com/)

### React
- [Documentation](https://react.dev/)

### Plotly
- [JavaScript Documentation](https://plotly.com/javascript/)

### uv
- [Documentation](https://github.com/astral-sh/uv)

---

Last updated: 2026-06-16 | Version 3.2
