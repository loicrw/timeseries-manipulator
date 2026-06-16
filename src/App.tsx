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
  positiveMultiplier: number;
  negativeMultiplier: number;
}

function App() {
  const [baseSeries, setBaseSeries] = useState<TimeSeriesData[]>([]);
  const [runningTotal, setRunningTotal] = useState<TimeSeriesData[]>([]);
  const [addedSeries, setAddedSeries] = useState<AddedSeriesMetadata[]>([]);
  const [availableSeries, setAvailableSeries] = useState<SeriesInfo[]>([]);
  const [aggregation, setAggregation] = useState<AggregationType>('raw');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [axisRanges, setAxisRanges] = useState<{xaxis?: [number, number], yaxis?: [number, number]} | null>(null);

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
  }, [aggregation, addedSeries, selectedYear]);

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
            addedSeriesFiles: addedSeries.map(s => ({
              file: s.file,
              positiveMultiplier: s.positiveMultiplier,
              negativeMultiplier: s.negativeMultiplier
            })),
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
      file: seriesInfo.file,
      positiveMultiplier: 1,
      negativeMultiplier: 1
    }]);
    setSelectedSeriesId('');
  };

  const removeSeries = (instanceId: string) => {
    setAddedSeries(prev => prev.filter(s => s.instanceId !== instanceId));
  };

  const updateMultiplier = (instanceId: string, field: 'positiveMultiplier' | 'negativeMultiplier', value: number) => {
    setAddedSeries(prev => prev.map(s =>
      s.instanceId === instanceId ? { ...s, [field]: value } : s
    ));
  };

  const plotData = useMemo(() => {
    const traces: any[] = [];

    if (baseSeries.length === 0) return traces;

    // Filter data by selected year
    const filterByYear = (data: TimeSeriesData[]) => {
      if (selectedYear === 'all') return data;
      const year = parseInt(selectedYear);
      return data.filter(d => d.timestamp.getFullYear() === year);
    };

    const filteredBase = filterByYear(baseSeries);
    const filteredTotal = filterByYear(runningTotal);

    // Add sum line first (drawn in background)
    if (addedSeries.length > 0) {
      traces.push({
        x: filteredTotal.map(d => d.timestamp),
        y: filteredTotal.map(d => d.energy_kwh),
        type: 'scattergl',
        mode: 'lines',
        name: 'Base + Additions',
        line: { color: '#FFB81C', width: 2 },
      });
    }

    // Add base line last (drawn on top)
    traces.push({
      x: filteredBase.map(d => d.timestamp),
      y: filteredBase.map(d => d.energy_kwh),
      type: 'scattergl',
      mode: 'lines',
      name: 'Base Load',
      line: { color: '#64696C', width: 2 },
    });

    return traces;
  }, [baseSeries, runningTotal, addedSeries, selectedYear]);

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
              className={`aggregation-btn ${aggregation === 'hourly' ? 'active' : ''}`}
              onClick={() => setAggregation('hourly')}
            >
              Hourly
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

        <div className="control-group">
          <label>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="year-select"
          >
            <option value="all">All Years</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          {addedSeries.length > 0 ? (
            <div className="loaded-series">
              <label>Added Series ({addedSeries.length}):</label>
              <div className="series-list">
                {addedSeries.map((series) => (
                  <div key={series.instanceId} className="series-item">
                    <div className="series-header">
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
                    <div className="series-multipliers">
                      <div className="multiplier-input">
                        <label>Positive multiplier:</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={series.positiveMultiplier}
                          onChange={(e) => updateMultiplier(series.instanceId, 'positiveMultiplier', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="multiplier-input">
                        <label>Negative multiplier:</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={series.negativeMultiplier}
                          onChange={(e) => updateMultiplier(series.instanceId, 'negativeMultiplier', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="loaded-series">
              <p className="empty-state">No series added yet. Select a series from the dropdown above to get started.</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <Plot
            data={plotData}
            layout={{
              title: 'Energy Consumption Time Series',
              xaxis: {
                title: 'Time',
                type: 'date',
                rangeslider: { visible: false },
                ...(axisRanges?.xaxis ? { range: axisRanges.xaxis } : {}),
              },
              yaxis: {
                title: 'Energy Consumption (kWh)',
                fixedrange: false,
                ...(axisRanges?.yaxis ? { range: axisRanges.yaxis } : {}),
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
            onRelayout={(event: any) => {
              // Capture zoom/pan changes
              const newRanges = { ...axisRanges };

              // Handle x-axis range changes
              if (event['xaxis.range[0]'] !== undefined && event['xaxis.range[1]'] !== undefined) {
                newRanges.xaxis = [event['xaxis.range[0]'], event['xaxis.range[1]']];
              } else if (event['xaxis.range']) {
                newRanges.xaxis = event['xaxis.range'];
              }

              // Handle y-axis range changes
              if (event['yaxis.range[0]'] !== undefined && event['yaxis.range[1]'] !== undefined) {
                newRanges.yaxis = [event['yaxis.range[0]'], event['yaxis.range[1]']];
              } else if (event['yaxis.range']) {
                newRanges.yaxis = event['yaxis.range'];
              }

              // Check for autorange (reset zoom)
              if (event['xaxis.autorange'] === true) {
                delete newRanges.xaxis;
              }
              if (event['yaxis.autorange'] === true) {
                delete newRanges.yaxis;
              }

              // Only update if we have valid ranges or if we're clearing them
              if (newRanges.xaxis || newRanges.yaxis || event['xaxis.autorange'] || event['yaxis.autorange']) {
                setAxisRanges(Object.keys(newRanges).length > 0 ? newRanges : null);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
