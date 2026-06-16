"""
Generate sample energy consumption time series data for the webapp.
Uses Polars to create realistic 15-minute interval data over 1 year.
"""
import polars as pl
from datetime import datetime, timedelta
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Generate timestamps: 15-minute intervals for 1 year
start_date = datetime(2025, 1, 1)
end_date = datetime(2025, 12, 31, 23, 45)
timestamps = []
current = start_date
while current <= end_date:
    timestamps.append(current)
    current += timedelta(minutes=15)

n_points = len(timestamps)

# Series 1: Residential building (base series)
# Pattern: daily cycle with peaks in morning/evening, weekly pattern, seasonal variation
def generate_residential(n):
    base = 50  # kWh baseline
    daily_pattern = np.array([np.sin(2 * np.pi * i / (24 * 4)) * 20 for i in range(n)])
    morning_peak = np.array([15 if (i % (24*4)) in range(28, 36) else 0 for i in range(n)])  # 7-9am
    evening_peak = np.array([25 if (i % (24*4)) in range(72, 84) else 0 for i in range(n)])  # 6-9pm
    weekly_pattern = np.array([10 if (i // (24*4)) % 7 in [5, 6] else 0 for i in range(n)])  # weekend reduction
    seasonal = np.array([20 * np.sin(2 * np.pi * i / (365 * 24 * 4)) for i in range(n)])  # yearly cycle
    noise = np.random.normal(0, 5, n)
    return base + daily_pattern + morning_peak + evening_peak + weekly_pattern + seasonal + noise

# Series 2: Commercial building
# Pattern: weekday heavy usage during business hours, minimal weekend usage
def generate_commercial(n):
    base = 30
    business_hours = np.array([50 if (i % (24*4)) in range(32, 72) and (i // (24*4)) % 7 < 5 else 0 for i in range(n)])  # 8am-6pm weekdays
    lunch_dip = np.array([-10 if (i % (24*4)) in range(48, 52) else 0 for i in range(n)])  # noon dip
    weekend = np.array([5 if (i // (24*4)) % 7 >= 5 else 0 for i in range(n)])  # minimal weekend
    seasonal = np.array([15 * np.sin(2 * np.pi * i / (365 * 24 * 4) + np.pi) for i in range(n)])  # opposite seasonal (more AC in summer)
    noise = np.random.normal(0, 3, n)
    return base + business_hours + lunch_dip + weekend + seasonal + noise

# Series 3: Industrial facility
# Pattern: constant high usage with occasional maintenance shutdowns
def generate_industrial(n):
    base = 150
    constant_load = np.full(n, base)
    # Random maintenance shutdowns (5-10 events per year)
    shutdowns = np.zeros(n)
    for _ in range(7):
        shutdown_start = np.random.randint(0, n - 96)  # random start
        shutdown_duration = np.random.randint(24, 96)  # 6-24 hours
        shutdowns[shutdown_start:shutdown_start + shutdown_duration] = -130  # drops to minimal
    seasonal = np.array([10 * np.sin(2 * np.pi * i / (365 * 24 * 4)) for i in range(n)])
    noise = np.random.normal(0, 8, n)
    return constant_load + shutdowns + seasonal + noise

# Generate data
residential_data = generate_residential(n_points)
commercial_data = generate_commercial(n_points)
industrial_data = generate_industrial(n_points)

# Create Polars DataFrames
df_residential = pl.DataFrame({
    'timestamp': timestamps,
    'energy_kwh': residential_data
})

df_commercial = pl.DataFrame({
    'timestamp': timestamps,
    'energy_kwh': commercial_data
})

df_industrial = pl.DataFrame({
    'timestamp': timestamps,
    'energy_kwh': industrial_data
})

# Ensure non-negative values
df_residential = df_residential.with_columns(
    pl.col('energy_kwh').clip(0, None)
)
df_commercial = df_commercial.with_columns(
    pl.col('energy_kwh').clip(0, None)
)
df_industrial = df_industrial.with_columns(
    pl.col('energy_kwh').clip(0, None)
)

# Save to CSV
df_residential.write_csv('public/data/residential.csv')
df_commercial.write_csv('public/data/commercial.csv')
df_industrial.write_csv('public/data/industrial.csv')

print(f"Generated {n_points} data points for each series")
print(f"Time range: {start_date} to {end_date}")
print(f"Interval: 15 minutes")
print(f"\nFiles created:")
print("  - public/data/residential.csv")
print("  - public/data/commercial.csv")
print("  - public/data/industrial.csv")
