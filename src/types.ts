export interface TimeSeriesData {
  timestamp: Date;
  energy_kwh: number;
}

export interface SeriesInfo {
  id: string;
  name: string;
  file: string;
  color: string;
}

export interface LoadedSeries {
  instanceId: string;
  info: SeriesInfo;
  data: TimeSeriesData[];
}

export type AggregationType = 'raw' | 'daily' | 'monthly' | 'yearly';
