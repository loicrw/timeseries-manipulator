import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { SeriesInfo, LoadedSeries, AggregationType, TimeSeriesData } from './types';
import { loadCSV } from './utils/dataLoader';
import { aggregateData } from './utils/aggregation';
import './App.css';

const BASE_SERIES: SeriesInfo = {
  id: 'base',
  name: 'Base Load',
  file: '/data/base.csv',
  color: '#1976D2'
};

const AVAILABLE_SERIES: SeriesInfo[] = [
  { id: 'residential_1', name: 'Residential 1', file: '/data/residential_1.csv', color: '#FF6B6B' },
  { id: 'residential_2', name: 'Residential 2', file: '/data/residential_2.csv', color: '#FF6B6B' },
  { id: 'residential_3', name: 'Residential 3', file: '/data/residential_3.csv', color: '#FF6B6B' },
  { id: 'commercial_1', name: 'Commercial 1', file: '/data/commercial_1.csv', color: '#4ECDC4' },
  { id: 'commercial_2', name: 'Commercial 2', file: '/data/commercial_2.csv', color: '#4ECDC4' },
  { id: 'commercial_3', name: 'Commercial 3', file: '/data/commercial_3.csv', color: '#4ECDC4' },
  { id: 'industrial_1', name: 'Industrial 1', file: '/data/industrial_1.csv', color: '#95E1D3' },
  { id: 'industrial_2', name: 'Industrial 2', file: '/data/industrial_2.csv', color: '#95E1D3' },
  { id: 'industrial_3', name: 'Industrial 3', file: '/data/industrial_3.csv', color: '#95E1D3' },
];

function App() {
  const [baseSeries, setBaseSeries] = useState<TimeSeriesData[]>([]);
  const [loadedSeries, setLoadedSeries] = useState<LoadedSeries[]>([]);
  const [aggregation, setAggregation] = useState<AggregationType>('raw');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');

  // Load base series on mount
  useEffect(() => {
    loadBaseSeries();
  }, []);

  const loadBaseSeries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadCSV(BASE_SERIES.file);
      setBaseSeries(data);
    } catch (err) {
      setError(`Failed to load base series: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const addSeries = async (seriesId: string) => {
    const seriesInfo = AVAILABLE_SERIES.find(s => s.id === seriesId);
    if (!seriesInfo) return;

    try {
      const data = await loadCSV(seriesInfo.file);
      const instanceId = `${seriesInfo.id}_${Date.now()}`;
      setLoadedSeries(prev => [...prev, {
        instanceId,
        info: seriesInfo,
        data
      }]);
      setSelectedSeriesId(''); // Reset dropdown
    } catch (err) {
      setError(`Failed to load ${seriesInfo.name}: ${err}`);
    }
  };

  const removeSeries = (instanceId: string) => {
    setLoadedSeries(prev => prev.filter(s => s.instanceId !== instanceId));
  };

  const getPlotData = () => {
    const traces: any[] = [];

    if (baseSeries.length === 0) return traces;

    const aggregatedBase = aggregateData(baseSeries, aggregation);

    // Pre-aggregate all loaded series once and create Maps for O(1) lookup
    const aggregatedSeriesMaps = loadedSeries.map(series => {
      const aggregated = aggregateData(series.data, aggregation);
      const dataMap = new Map(aggregated.map(d => [d.timestamp.toISOString(), d.energy_kwh]));
      return dataMap;
    });

    // Calculate sum of base + all loaded series
    const sumData = aggregatedBase.map(basePoint => {
      let sum = basePoint.energy_kwh;

      aggregatedSeriesMaps.forEach(dataMap => {
        const value = dataMap.get(basePoint.timestamp.toISOString());
        if (value !== undefined) {
          sum += value;
        }
      });

      return { timestamp: basePoint.timestamp, energy_kwh: sum };
    });

    // Add base line first (for fill to reference)
    traces.push({
      x: aggregatedBase.map(d => d.timestamp),
      y: aggregatedBase.map(d => d.energy_kwh),
      type: 'scatter',
      mode: 'lines',
      name: 'Base Load',
      line: { color: '#1976D2', width: 2 },
      fill: 'tozeroy',
      fillcolor: 'rgba(25, 118, 210, 0.1)',
    });

    // Add sum line with fill to previous trace (base)
    traces.push({
      x: aggregatedBase.map(d => d.timestamp),
      y: sumData.map(d => d.energy_kwh),
      fill: 'tonexty',
      fillcolor: 'rgba(76, 175, 80, 0.3)',
      type: 'scatter',
      mode: 'lines',
      name: 'Base + Additions',
      line: { color: '#4CAF50', width: 2 },
    });

    return traces;
  };

  const handleSeriesSelect = (seriesId: string) => {
    if (seriesId) {
      addSeries(seriesId);
    }
  };

  if (loading && loadedSeries.length === 0) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Time Series Manipulator</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="controls">
        <div className="control-group">
          <label>Add Series:</label>
          <select
            value={selectedSeriesId}
            onChange={(e) => {
              setSelectedSeriesId(e.target.value);
              handleSeriesSelect(e.target.value);
            }}
          >
            <option value="">Select a series...</option>
            {AVAILABLE_SERIES.map(series => (
              <option key={series.id} value={series.id}>
                {series.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Aggregation:</label>
          <div className="aggregation-buttons">
            <button
              className={`aggregation-btn ${aggregation === 'raw' ? 'active' : ''}`}
              onClick={() => setAggregation('raw')}
            >
              Raw (15min)
            </button>
            <button
              className={`aggregation-btn ${aggregation === 'daily' ? 'active' : ''}`}
              onClick={() => setAggregation('daily')}
            >
              Daily
            </button>
            <button
              className={`aggregation-btn ${aggregation === 'monthly' ? 'active' : ''}`}
              onClick={() => setAggregation('monthly')}
            >
              Monthly
            </button>
            <button
              className={`aggregation-btn ${aggregation === 'yearly' ? 'active' : ''}`}
              onClick={() => setAggregation('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {loadedSeries.length > 0 && (
        <div className="loaded-series">
          <label>Added Series ({loadedSeries.length}):</label>
          <div className="series-tags">
            {loadedSeries.map((series) => (
              <div key={series.instanceId} className="series-tag">
                <span className="series-color" style={{ backgroundColor: series.info.color }}></span>
                <span className="series-name">{series.info.name}</span>
                <button
                  className="remove-btn"
                  onClick={() => removeSeries(series.instanceId)}
                  title="Remove series"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="chart-container">
        <Plot
          data={getPlotData()}
          layout={{
            title: 'Energy Consumption Time Series',
            xaxis: {
              title: 'Time',
              type: 'date',
              rangeslider: { visible: false },
            },
            yaxis: {
              title: 'Energy Consumption (kWh)',
              fixedrange: false,
            },
            hovermode: 'x unified',
            dragmode: 'zoom',
            height: 600,
            margin: { t: 50, r: 50, b: 100, l: 80 },
          }}
          config={{
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
            scrollZoom: true,
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

export default App;
