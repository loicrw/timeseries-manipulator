#!/bin/bash

echo "Testing Time Series API..."
echo ""

echo "1. Testing GET /api/series"
curl -s http://localhost:3001/api/series | head -c 200
echo "..."
echo ""

echo "2. Testing GET /api/base?aggregation=daily (first 3 points)"
curl -s "http://localhost:3001/api/base?aggregation=daily" | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
console.log('Total points:', data.data.length);
console.log('First 3 points:');
data.data.slice(0, 3).forEach(p => console.log('  ', p.timestamp, '->', p.energy_kwh.toFixed(2), 'kWh'));
"
echo ""

echo "3. Testing POST /api/running-total (base + residential_1, monthly)"
curl -s -X POST http://localhost:3001/api/running-total \
  -H "Content-Type: application/json" \
  -d '{"addedSeriesFiles":["residential_1.csv"],"aggregation":"monthly"}' | node -e "
const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
console.log('Total points:', data.data.length);
console.log('First 3 points:');
data.data.slice(0, 3).forEach(p => console.log('  ', p.timestamp, '->', p.energy_kwh.toFixed(2), 'kWh'));
"
echo ""

echo "✅ API tests complete!"
