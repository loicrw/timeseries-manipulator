import { TimeSeriesData } from '../types';

export async function loadCSV(filePath: string): Promise<TimeSeriesData[]> {
  const response = await fetch(filePath);
  const text = await response.text();

  const lines = text.trim().split('\n');
  const data: TimeSeriesData[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const [timestamp, energy] = lines[i].split(',');
    data.push({
      timestamp: new Date(timestamp),
      energy_kwh: parseFloat(energy)
    });
  }

  return data;
}
