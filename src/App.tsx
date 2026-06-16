import { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { SeriesInfo, AggregationType, TimeSeriesData } from './types';
import './App.css';

const API_BASE = 'http://localhost:3001/api';

interface AddedSeriesMetadata {
  instanceId: string;
  seriesId: string;
  name: string;
  color: string;
  file: string;
}

function App() {
  const [baseSeries, setBaseSeries] = useState<TimeSeriesData[]>([]);
  const [runningTotal, setRunningTotal] = useState<TimeSeriesData[]>([]);
  const [addedSeries, setAddedSeries] = useState<AddedSeriesMetadata[]>([]);
  const [availableSeries, setAvailableSeries] = useState<SeriesInfo[]>([]);
  const [aggregation, setAggregation] = useState<AggregationType>('raw');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');

  // Load available series list
  useEffect(() => {
    fetch(`${API_BASE}/series`)
      .then(res => res.json())
      .then(data => setAvailableSeries(data.series))
      .catch(err => console.error('Failed to load series list:', err));
  }, []);

  // Load data from API
  useEffect(() => {
    loadData();
  }, [aggregation, addedSeries]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch base series
      const baseRes = await fetch(`${API_BASE}/base?aggregation=${aggregation}`);
      const baseData = await baseRes.json();
      const basePoints = baseData.data.map((p: any) => ({
        timestamp: new Date(p.timestamp),
        energy_kwh: p.energy_kwh
      }));
      setBaseSeries(basePoints);

      // Fetch running total if series are added
      if (addedSeries.length > 0) {
        const totalRes = await fetch(`${API_BASE}/running-total`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            addedSeriesFiles: addedSeries.map(s => s.file),
            aggregation
          })
        });
        const totalData = await totalRes.json();
        const totalPoints = totalData.data.map((p: any) => ({
          timestamp: new Date(p.timestamp),
          energy_kwh: p.energy_kwh
        }));
        setRunningTotal(totalPoints);
      } else {
        setRunningTotal(basePoints);
      }
    } catch (err) {
      setError(`Failed to load data: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const addSeries = (seriesId: string) => {
    const seriesInfo = availableSeries.find(s => s.id === seriesId);
    if (!seriesInfo) return;

    const instanceId = `${seriesInfo.id}_${Date.now()}`;
    setAddedSeries(prev => [...prev, {
      instanceId,
      seriesId: seriesInfo.id,
      name: seriesInfo.name,
      color: seriesInfo.color,
      file: seriesInfo.file
    }]);
    setSelectedSeriesId('');
  };

  const removeSeries = (instanceId: string) => {
    setAddedSeries(prev => prev.filter(s => s.instanceId !== instanceId));
  };

  const plotData = useMemo(() => {
    const traces: any[] = [];

    if (baseSeries.length === 0) return traces;

    // Add base line first (for fill to reference)
    traces.push({
      x: baseSeries.map(d => d.timestamp),
      y: baseSeries.map(d => d.energy_kwh),
      type: 'scattergl',
      mode: 'lines',
      name: 'Base Load',
      line: { color: '#1976D2', width: 2 },
      fill: 'tozeroy',
      fillcolor: 'rgba(25, 118, 210, 0.1)',
    });

    // Add sum line with fill to previous trace (base)
    if (addedSeries.length > 0) {
      traces.push({
        x: runningTotal.map(d => d.timestamp),
        y: runningTotal.map(d => d.energy_kwh),
        fill: 'tonexty',
        fillcolor: 'rgba(76, 175, 80, 0.3)',
        type: 'scattergl',
        mode: 'lines',
        name: 'Base + Additions',
        line: { color: '#4CAF50', width: 2 },
      });
    }

    return traces;
  }, [baseSeries, runningTotal, addedSeries]);

  const handleSeriesSelect = (seriesId: string) => {
    if (seriesId) {
      addSeries(seriesId);
    }
  };

  if (loading && addedSeries.length === 0) {
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
            {availableSeries.map(series => (
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

      {addedSeries.length > 0 && (
        <div className="loaded-series">
          <label>Added Series ({addedSeries.length}):</label>
          <div className="series-tags">
            {addedSeries.map((series) => (
              <div key={series.instanceId} className="series-tag">
                <span className="series-color" style={{ backgroundColor: series.color }}></span>
                <span className="series-name">{series.name}</span>
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
          data={plotData}
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
