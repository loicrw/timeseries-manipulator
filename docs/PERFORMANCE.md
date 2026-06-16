# Performance Analysis

## Why Polars is Faster

### 1. Vectorized Operations
- **JavaScript**: Row-by-row processing
- **Polars**: Operates on entire columns at once using SIMD

### 2. Multi-threading
- **JavaScript**: Single-threaded (V8)
- **Polars**: Automatically parallelizes across CPU cores

### 3. Memory Layout
- **JavaScript**: Array of objects (row-oriented)
- **Polars**: Apache Arrow format (column-oriented, cache-friendly)

### 4. Written in Rust
- **JavaScript**: JIT-compiled by V8
- **Polars**: Compiled Rust with zero-cost abstractions

### 5. Query Optimization
- **JavaScript**: Execute operations as written
- **Polars**: Optimizes query plan before execution

### 6. Type System
- **JavaScript**: Dynamic typing, runtime checks
- **Polars**: Static typing, compile-time guarantees

## Code Comparison

### Loading CSV Data

**JavaScript:**
```javascript
function parseCSV(csvText: string): ParsedPoint[] {
  const lines = csvText.split('\n');
  const data: ParsedPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const commaIndex = line.indexOf(',');
    const timestamp = new Date(line.substring(0, commaIndex));
    const energy = parseFloat(line.substring(commaIndex + 1));
    
    data.push({ timestamp, energy_kwh: energy });
  }
  return data;
}
```

**Polars:**
```python
df = pl.read_csv(
    filepath,
    schema={"timestamp": pl.Utf8, "energy_kwh": pl.Float64}
).with_columns([
    pl.col("timestamp").str.to_datetime("%Y-%m-%dT%H:%M:%S")
])
```

✅ **Polars wins**: Cleaner code, optimized parsing

### Aggregating Data

**JavaScript:**
```javascript
function aggregateData(data: ParsedPoint[], aggregation: string): ParsedPoint[] {
  const buckets = new Map<number, { sum: number; count: number }>();

  for (const point of data) {
    let bucketKey: number;
    const date = point.timestamp;

    switch (aggregation) {
      case 'daily':
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        bucketKey = d.getTime();
        break;
    }

    const bucket = buckets.get(bucketKey) || { sum: 0, count: 0 };
    bucket.sum += point.energy_kwh;
    bucket.count++;
    buckets.set(bucketKey, bucket);
  }

  const result: ParsedPoint[] = [];
  for (const [time, bucket] of buckets) {
    result.push({
      timestamp: new Date(time),
      energy_kwh: bucket.sum / bucket.count
    });
  }

  result.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  return result;
}
```

**Polars:**
```python
return (
    df
    .with_columns([pl.col("timestamp").dt.truncate(truncate_rule)])
    .group_by("timestamp")
    .agg([pl.col("energy_kwh").mean()])
    .sort("timestamp")
)
```

✅ **Polars wins**: 5 lines vs 30+, vectorized operations

### Adding Multiple Series

**JavaScript:**
```javascript
function addSeries(base: ParsedPoint[], seriesToAdd: ParsedPoint[][]): ParsedPoint[] {
  const result: ParsedPoint[] = new Array(base.length);
  
  const seriesMaps = seriesToAdd.map(series => {
    const map = new Map<number, number>();
    for (const point of series) {
      map.set(point.timestamp.getTime(), point.energy_kwh);
    }
    return map;
  });

  for (let i = 0; i < base.length; i++) {
    const basePoint = base[i];
    const timeKey = basePoint.timestamp.getTime();
    let total = basePoint.energy_kwh;

    for (const seriesMap of seriesMaps) {
      total += seriesMap.get(timeKey) || 0;
    }

    result[i] = {
      timestamp: basePoint.timestamp,
      energy_kwh: total
    };
  }

  return result;
}
```

**Polars:**
```python
result_df = base_df.clone()

for filename in series_files:
    series_df = load_dataframe(filename)
    
    result_df = (
        result_df
        .join(series_df, on="timestamp", how="left", suffix="_add")
        .with_columns([
            (pl.col("energy_kwh") + pl.col("energy_kwh_add").fill_null(0))
            .alias("energy_kwh")
        ])
        .select(["timestamp", "energy_kwh"])
    )

return result_df
```

✅ **Polars wins**: Cleaner join operations, multi-threaded

## Code Quality

### Lines of Code

| Feature | JavaScript | Polars | Reduction |
|---------|-----------|--------|-----------|
| CSV Loading | ~25 lines | ~8 lines | 68% |
| Aggregation | ~35 lines | ~10 lines | 71% |
| Series Addition | ~30 lines | ~15 lines | 50% |
| **Total** | ~90 lines | ~33 lines | 63% |

### Readability

**JavaScript:**
- Manual loop management
- Explicit type conversions
- Complex Map operations
- Error-prone date handling

**Polars:**
- Declarative operations
- Built-in type handling
- Clean method chaining
- Optimized date functions

## When to Use Each

### Use Polars when:
- Processing large datasets (>10k rows)
- Complex aggregations and joins
- Performance is critical
- Python available
- Want cleaner, maintainable code

### Use JavaScript when:
- Very small datasets (<1k rows)
- Can't use Python runtime
- Need tight Node.js integration
- Performance not a bottleneck

## Conclusion

For timeseries apps with 175k+ data points per series:
- Polars is significantly faster
- Uses less memory due to columnar storage
- Less code to maintain
- More readable and maintainable

The Python + Polars backend is the clear choice for data-heavy applications.
