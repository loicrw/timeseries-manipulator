"""
Generate sample energy consumption time series data for the webapp.
Simple version without external dependencies.
"""
from datetime import datetime, timedelta
import math
import random

# Generate timestamps: 15-minute intervals for 5 years
start_date = datetime(2021, 1, 1)
end_date = datetime(2025, 12, 31, 23, 45)
timestamps = []
current = start_date
while current <= end_date:
    timestamps.append(current)
    current += timedelta(minutes=15)

n_points = len(timestamps)

# Base series: Large baseline load
def generate_base(timestamps):
    random.seed(42)
    data = []
    for i, ts in enumerate(timestamps):
        base = 500  # Much larger baseline (500 kWh)
        # Slow seasonal variation
        seasonal = 100 * math.sin(2 * math.pi * i / (365 * 24 * 4))
        # Weekly pattern
        day_of_week = (i // (24 * 4)) % 7
        weekly = 50 * math.sin(2 * math.pi * day_of_week / 7)
        # Small daily variation
        daily = 30 * math.sin(2 * math.pi * i / (24 * 4))
        # Noise
        noise = random.gauss(0, 15)

        value = base + seasonal + weekly + daily + noise
        data.append(max(0, value))
    return data

# Series 1: Residential building
def generate_residential(timestamps, seed_offset=0, variation=1.0):
    random.seed(42 + seed_offset)
    data = []
    for i, ts in enumerate(timestamps):
        base = 50 * variation  # kWh baseline
        # Daily pattern (sine wave with 24-hour period)
        daily = math.sin(2 * math.pi * i / (24 * 4)) * 20 * variation
        # Morning peak (7-9am)
        hour_of_day = (i % (24 * 4)) / 4
        morning_peak = 15 * variation if 7 <= hour_of_day < 9 else 0
        # Evening peak (6-9pm)
        evening_peak = 25 * variation if 18 <= hour_of_day < 21 else 0
        # Weekend pattern (lower on Sat/Sun)
        day_of_week = (i // (24 * 4)) % 7
        weekly = 10 * variation if day_of_week in [5, 6] else 0
        # Seasonal (summer/winter variation)
        seasonal = 20 * variation * math.sin(2 * math.pi * i / (365 * 24 * 4))
        # Random noise
        noise = random.gauss(0, 5 * variation)

        value = base + daily + morning_peak + evening_peak + weekly + seasonal + noise
        data.append(max(0, value))  # Ensure non-negative
    return data

# Series 2: Commercial building
def generate_commercial(timestamps, seed_offset=0, variation=1.0):
    random.seed(42 + seed_offset)
    data = []
    for i, ts in enumerate(timestamps):
        base = 30 * variation
        hour_of_day = (i % (24 * 4)) / 4
        day_of_week = (i // (24 * 4)) % 7

        # Business hours (8am-6pm weekdays)
        business_hours = 50 * variation if (8 <= hour_of_day < 18 and day_of_week < 5) else 0
        # Lunch dip (12pm-1pm)
        lunch_dip = -10 * variation if (12 <= hour_of_day < 13) else 0
        # Minimal weekend usage
        weekend = 5 * variation if day_of_week >= 5 else 0
        # Seasonal (opposite pattern - more AC in summer)
        seasonal = 15 * variation * math.sin(2 * math.pi * i / (365 * 24 * 4) + math.pi)
        # Noise
        noise = random.gauss(0, 3 * variation)

        value = base + business_hours + lunch_dip + weekend + seasonal + noise
        data.append(max(0, value))
    return data

# Series 3: Industrial facility
def generate_industrial(timestamps, seed_offset=0, variation=1.0, n_points=None):
    random.seed(42 + seed_offset)
    data = []
    if n_points is None:
        n_points = len(timestamps)
    # Generate random maintenance shutdown periods
    shutdowns = []
    for _ in range(35):  # More shutdowns for 5 years (7 per year * 5)
        start = random.randint(0, n_points - 96)
        duration = random.randint(24, 96)
        shutdowns.append((start, start + duration))

    for i, ts in enumerate(timestamps):
        base = 150 * variation

        # Check if in shutdown period
        in_shutdown = any(start <= i < end for start, end in shutdowns)
        shutdown_effect = -130 * variation if in_shutdown else 0

        # Seasonal variation
        seasonal = 10 * variation * math.sin(2 * math.pi * i / (365 * 24 * 4))
        # Noise
        noise = random.gauss(0, 8 * variation)

        value = base + shutdown_effect + seasonal + noise
        data.append(max(0, value))
    return data

# Generate data - base series + 3 versions of each type
print(f"Generating {n_points} data points for each series...")

# Write to CSV files
def write_csv(filename, timestamps, values):
    with open(filename, 'w') as f:
        f.write('timestamp,energy_kwh\n')
        for ts, val in zip(timestamps, values):
            f.write(f'{ts.isoformat()},{val:.2f}\n')

# Generate base series
base_data = generate_base(timestamps)
write_csv('public/data/base.csv', timestamps, base_data)
print(f"  Base: avg={sum(base_data)/len(base_data):.1f} kWh, min={min(base_data):.1f}, max={max(base_data):.1f}")

# Generate 3 versions of residential
variations = [(100, 1.0), (200, 0.9), (300, 1.1)]  # Different seeds and scales
for i, (seed_offset, variation) in enumerate(variations, 1):
    data = generate_residential(timestamps, seed_offset, variation)
    write_csv(f'public/data/residential_{i}.csv', timestamps, data)
    print(f"  Residential {i}: avg={sum(data)/len(data):.1f} kWh, min={min(data):.1f}, max={max(data):.1f}")

# Generate 3 versions of commercial
for i, (seed_offset, variation) in enumerate(variations, 1):
    data = generate_commercial(timestamps, seed_offset, variation)
    write_csv(f'public/data/commercial_{i}.csv', timestamps, data)
    print(f"  Commercial {i}: avg={sum(data)/len(data):.1f} kWh, min={min(data):.1f}, max={max(data):.1f}")

# Generate 3 versions of industrial
for i, (seed_offset, variation) in enumerate(variations, 1):
    data = generate_industrial(timestamps, seed_offset, variation, n_points)
    write_csv(f'public/data/industrial_{i}.csv', timestamps, data)
    print(f"  Industrial {i}: avg={sum(data)/len(data):.1f} kWh, min={min(data):.1f}, max={max(data):.1f}")

print(f"\nGenerated {n_points} data points for each series")
print(f"Time range: {start_date} to {end_date}")
print(f"Interval: 15 minutes")
print(f"\nFiles created:")
print("  - public/data/base.csv")
print("  - public/data/residential_1.csv, residential_2.csv, residential_3.csv")
print("  - public/data/commercial_1.csv, commercial_2.csv, commercial_3.csv")
print("  - public/data/industrial_1.csv, industrial_2.csv, industrial_3.csv")
