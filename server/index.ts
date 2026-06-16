import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

interface TimeSeriesPoint {
  timestamp: string;
  energy_kwh: number;
}

interface ParsedPoint {
  timestamp: Date;
  energy_kwh: number;
}

// Cache for loaded CSV data
const dataCache = new Map<string, ParsedPoint[]>();

// Fast CSV parser
function parseCSV(csvText: string): ParsedPoint[] {
  const lines = csvText.split('\n');
  const data: ParsedPoint[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const commaIndex = line.indexOf(',');
    if (commaIndex === -1) continue;

    const timestamp = new Date(line.substring(0, commaIndex));
    const energy = parseFloat(line.substring(commaIndex + 1));

    if (!isNaN(timestamp.getTime()) && !isNaN(energy)) {
      data.push({ timestamp, energy_kwh: energy });
    }
  }

  return data;
}

// Load CSV with caching
function loadData(file: string): ParsedPoint[] {
  if (dataCache.has(file)) {
    return dataCache.get(file)!;
  }

  const filePath = path.join(__dirname, '..', 'public', 'data', file);
  const csvText = fs.readFileSync(filePath, 'utf-8');
  const data = parseCSV(csvText);

  dataCache.set(file, data);
  return data;
}

// Fast aggregation using typed arrays for performance
function aggregateData(data: ParsedPoint[], aggregation: string): ParsedPoint[] {
  if (aggregation === 'raw') {
    return data;
  }

  const buckets = new Map<number, { sum: number; count: number }>();

  for (const point of data) {
    let bucketKey: number;
    const date = point.timestamp;

    switch (aggregation) {
      case 'daily': {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        bucketKey = d.getTime();
        break;
      }
      case 'monthly': {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
        bucketKey = d.getTime();
        break;
      }
      case 'yearly': {
        const d = new Date(Date.UTC(date.getFullYear(), 0, 1));
        bucketKey = d.getTime();
        break;
      }
      default:
        bucketKey = point.timestamp.getTime();
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

// Fast series addition using Map for O(1) lookups
function addSeries(base: ParsedPoint[], seriesToAdd: ParsedPoint[][]): ParsedPoint[] {
  const result: ParsedPoint[] = new Array(base.length);

  // Build maps for each series to add (timestamp -> value)
  const seriesMaps = seriesToAdd.map(series => {
    const map = new Map<number, number>();
    for (const point of series) {
      map.set(point.timestamp.getTime(), point.energy_kwh);
    }
    return map;
  });

  // Process each base point
  for (let i = 0; i < base.length; i++) {
    const basePoint = base[i];
    const timeKey = basePoint.timestamp.getTime();
    let total = basePoint.energy_kwh;

    // Add values from all series
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

// Convert to JSON format
function toJSON(data: ParsedPoint[]): TimeSeriesPoint[] {
  return data.map(p => ({
    timestamp: p.timestamp.toISOString(),
    energy_kwh: p.energy_kwh
  }));
}

// Load base series
app.get('/api/base', (req, res) => {
  try {
    const aggregation = req.query.aggregation as string || 'raw';
    const data = loadData('base.csv');
    const aggregated = aggregateData(data, aggregation);
    const jsonData = toJSON(aggregated);

    res.json({ data: jsonData });
  } catch (error) {
    console.error('Error loading base series:', error);
    res.status(500).json({ error: 'Failed to load base series' });
  }
});

// Get running total with multiple series added
app.post('/api/running-total', (req, res) => {
  try {
    const { addedSeriesFiles, aggregation } = req.body;

    // Load base
    const baseData = loadData('base.csv');

    // Load all series to add
    const seriesToAdd = addedSeriesFiles.map((file: string) => loadData(file));

    // Add series together
    const combined = addSeries(baseData, seriesToAdd);

    // Aggregate
    const aggregated = aggregateData(combined, aggregation);
    const jsonData = toJSON(aggregated);

    res.json({ data: jsonData });
  } catch (error) {
    console.error('Error calculating running total:', error);
    res.status(500).json({ error: 'Failed to calculate running total' });
  }
});

// List available series
app.get('/api/series', (req, res) => {
  const series = [
    { id: 'residential_1', name: 'Residential 1', file: 'residential_1.csv', color: '#FF6B6B' },
    { id: 'residential_2', name: 'Residential 2', file: 'residential_2.csv', color: '#FF6B6B' },
    { id: 'residential_3', name: 'Residential 3', file: 'residential_3.csv', color: '#FF6B6B' },
    { id: 'commercial_1', name: 'Commercial 1', file: 'commercial_1.csv', color: '#4ECDC4' },
    { id: 'commercial_2', name: 'Commercial 2', file: 'commercial_2.csv', color: '#4ECDC4' },
    { id: 'commercial_3', name: 'Commercial 3', file: 'commercial_3.csv', color: '#4ECDC4' },
    { id: 'industrial_1', name: 'Industrial 1', file: 'industrial_1.csv', color: '#95E1D3' },
    { id: 'industrial_2', name: 'Industrial 2', file: 'industrial_2.csv', color: '#95E1D3' },
    { id: 'industrial_3', name: 'Industrial 3', file: 'industrial_3.csv', color: '#95E1D3' },
  ];

  res.json({ series });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /api/base?aggregation=raw|daily|monthly|yearly`);
  console.log(`   POST /api/running-total`);
  console.log(`   GET  /api/series\n`);
});
