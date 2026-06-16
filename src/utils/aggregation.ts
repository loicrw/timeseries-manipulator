
import { TimeSeriesData, AggregationType } from '../types';

export function aggregateData(
  data: TimeSeriesData[],
  aggregation: AggregationType
): TimeSeriesData[] {
  if (aggregation === 'raw') {
    return data;
  }

  const grouped = new Map<string, number[]>();

  data.forEach(point => {
    let key: string;
    const date = point.timestamp;

    switch (aggregation) {
      case 'daily':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'yearly':
        key = `${date.getFullYear()}`;
        break;
      default:
        key = date.toISOString();
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(point.energy_kwh);
  });

  const aggregated: TimeSeriesData[] = [];
  grouped.forEach((values, key) => {
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    let timestamp: Date;
    switch (aggregation) {
      case 'daily':
        timestamp = new Date(key);
        break;
      case 'monthly':
        timestamp = new Date(key + '-01');
        break;
      case 'yearly':
        timestamp = new Date(key + '-01-01');
        break;
      default:
        timestamp = new Date(key);
    }

    aggregated.push({
      timestamp,
      energy_kwh: avg
    });
  });

  return aggregated.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
