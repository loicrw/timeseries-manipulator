from flask import Flask, jsonify, request
from flask_cors import CORS
import polars as pl
from pathlib import Path
from typing import Dict

app = Flask(__name__)
CORS(app)

# Cache for loaded dataframes
df_cache: Dict[str, pl.DataFrame] = {}

# Path to data files
DATA_DIR = Path(__file__).parent.parent / "public" / "data"


def load_dataframe(filename: str) -> pl.DataFrame:
    """Load a CSV file as a Polars DataFrame with caching."""
    if filename in df_cache:
        return df_cache[filename]

    filepath = DATA_DIR / filename

    # Polars optimized CSV reading
    df = pl.read_csv(
        filepath, schema={"timestamp": pl.Utf8, "energy_kwh": pl.Float64}
    ).with_columns([pl.col("timestamp").str.to_datetime("%Y-%m-%dT%H:%M:%S")])

    df_cache[filename] = df
    return df


def aggregate_dataframe(df: pl.DataFrame, aggregation: str) -> pl.DataFrame:
    """Aggregate dataframe using Polars groupby operations."""
    if aggregation == "raw":
        return df

    # Polars truncate operations are blazing fast
    truncate_rule = {"daily": "1d", "monthly": "1mo", "yearly": "1y"}.get(
        aggregation, "1d"
    )

    return (
        df.with_columns(
            [pl.col("timestamp").dt.truncate(truncate_rule).alias("timestamp")]
        )
        .group_by("timestamp")
        .agg([pl.col("energy_kwh").mean()])
        .sort("timestamp")
    )


def add_series(base_df: pl.DataFrame, series_files: list[str]) -> pl.DataFrame:
    """Add multiple series to base using Polars join and sum operations."""
    result_df = base_df.clone()

    for filename in series_files:
        series_df = load_dataframe(filename)

        # Polars join is extremely fast (hash-based)
        result_df = (
            result_df.join(series_df, on="timestamp", how="left", suffix="_add")
            .with_columns(
                [
                    (
                        pl.col("energy_kwh") + pl.col("energy_kwh_add").fill_null(0)
                    ).alias("energy_kwh")
                ]
            )
            .select(["timestamp", "energy_kwh"])
        )

    return result_df


def df_to_json(df: pl.DataFrame) -> list[dict]:
    """Convert Polars DataFrame to JSON-serializable list."""
    return [
        {"timestamp": row[0].isoformat(), "energy_kwh": row[1]}
        for row in df.iter_rows()
    ]


@app.route("/api/series", methods=["GET"])
def get_series_list():
    """Return list of available time series."""
    colours = {
        "residential": "#106300",
        "commercial": "#0003CF",
        "industrial": "#CC8C00",
        "solar": "#E4D500",
    }
    series = [
        {
            "id": "residential_1",
            "name": "Residential 1",
            "file": "residential_1.csv",
            "color": colours["residential"],
        },
        {
            "id": "residential_2",
            "name": "Residential 2",
            "file": "residential_2.csv",
            "color": colours["residential"],
        },
        {
            "id": "residential_3",
            "name": "Residential 3",
            "file": "residential_3.csv",
            "color": colours["residential"],
        },
        {
            "id": "commercial_1",
            "name": "Commercial 1",
            "file": "commercial_1.csv",
            "color": colours["commercial"],
        },
        {
            "id": "commercial_2",
            "name": "Commercial 2",
            "file": "commercial_2.csv",
            "color": colours["commercial"],
        },
        {
            "id": "commercial_3",
            "name": "Commercial 3",
            "file": "commercial_3.csv",
            "color": colours["commercial"],
        },
        {
            "id": "industrial_1",
            "name": "Industrial 1",
            "file": "industrial_1.csv",
            "color": colours["industrial"],
        },
        {
            "id": "industrial_2",
            "name": "Industrial 2",
            "file": "industrial_2.csv",
            "color": colours["industrial"],
        },
        {
            "id": "industrial_3",
            "name": "Industrial 3",
            "file": "industrial_3.csv",
            "color": colours["industrial"],
        },
        {
            "id": "solar_1",
            "name": "Solar 1",
            "file": "solar_1.csv",
            "color": colours["solar"],
        },
        {
            "id": "solar_2",
            "name": "Solar 2",
            "file": "solar_2.csv",
            "color": colours["solar"],
        },
        {
            "id": "solar_3",
            "name": "Solar 3",
            "file": "solar_3.csv",
            "color": colours["solar"],
        },
    ]
    return jsonify({"series": series})


@app.route("/api/base", methods=["GET"])
def get_base_series():
    """Get base series with optional aggregation."""
    try:
        aggregation = request.args.get("aggregation", "raw")

        # Load and aggregate using Polars
        df = load_dataframe("base.csv")
        aggregated_df = aggregate_dataframe(df, aggregation)
        data = df_to_json(aggregated_df)

        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/running-total", methods=["POST"])
def get_running_total():
    """Calculate running total (base + added series) with aggregation."""
    try:
        body = request.get_json()
        added_series_files = body.get("addedSeriesFiles", [])
        aggregation = body.get("aggregation", "raw")

        # Load base
        base_df = load_dataframe("base.csv")

        # Add all series using Polars operations
        combined_df = add_series(base_df, added_series_files)

        # Aggregate
        aggregated_df = aggregate_dataframe(combined_df, aggregation)
        data = df_to_json(aggregated_df)

        return jsonify({"data": data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("\n🚀 Polars-powered API Server")
    print("📊 Endpoints:")
    print("   GET  /api/series")
    print("   GET  /api/base?aggregation=raw|daily|monthly|yearly")
    print("   POST /api/running-total")
    print("\n✨ Using Polars for blazing-fast DataFrame operations\n")

    app.run(host="0.0.0.0", port=3001, debug=True)
