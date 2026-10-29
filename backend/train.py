"""
Height-Weight Linear Regression Model Training Pipeline
Trains a Linear Regression model with StandardScaler on height-weight dataset.
Saves model, scaler, and rich metadata for production API and frontend visualization.
"""

import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib


def train_model():
    base_dir = Path(__file__).resolve().parent
    repo_root = base_dir.parent
    data_path = repo_root / "data_source_excel" / "height-weight.csv"

    if not data_path.exists():
        # Fallback to local data folder if running in standalone backend
        data_path = base_dir / "height-weight.csv"

    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"Dataset loaded: {len(df)} records.")
    print(df.head())

    X = df[["Weight"]]
    y = df["Height"]

    # Match notebook split: test_size=0.25, random_state=42
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42
    )

    # Standardization
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Model fitting
    model = LinearRegression()
    model.fit(X_train_scaled, y_train)

    # Predictions
    y_pred_train = model.predict(X_train_scaled)
    y_pred_test = model.predict(X_test_scaled)

    # Metrics evaluation
    mse_test = mean_squared_error(y_test, y_pred_test)
    rmse_test = float(np.sqrt(mse_test))
    mae_test = float(mean_absolute_error(y_test, y_pred_test))
    r2_test = float(r2_score(y_test, y_pred_test))

    r2_train = float(r2_score(y_train, y_pred_train))

    # Adjusted R2 for test set
    n_test = len(y_test)
    p = 1
    adj_r2_test = float(1 - ((1 - r2_test) * (n_test - 1) / (n_test - p - 1)))

    pearson_r = float(df["Weight"].corr(df["Height"]))

    slope = float(model.coef_[0])
    intercept = float(model.intercept_)
    mean_weight = float(scaler.mean_[0])
    scale_weight = float(scaler.scale_[0])

    print("\n--- Model Training Results ---")
    print(f"Slope (beta_1): {slope:.4f}")
    print(f"Intercept (beta_0): {intercept:.4f}")
    print(f"Scaler Mean (mu): {mean_weight:.4f}")
    print(f"Scaler Scale (sigma): {scale_weight:.4f}")
    print(f"Train R^2: {r2_train:.4f}")
    print(f"Test R^2: {r2_test:.4f}")
    print(f"Test Adjusted R^2: {adj_r2_test:.4f}")
    print(f"Test MAE: {mae_test:.4f} cm")
    print(f"Test MSE: {mse_test:.4f}")
    print(f"Test RMSE: {rmse_test:.4f} cm")
    print(f"Pearson Correlation (r): {pearson_r:.4f}")

    # Prepare artifacts directory
    artifacts_dir = base_dir / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    # Save joblib models
    scaler_file = artifacts_dir / "scaler.joblib"
    model_file = artifacts_dir / "model.joblib"
    metadata_file = artifacts_dir / "model_metadata.json"

    joblib.dump(scaler, scaler_file)
    joblib.dump(model, model_file)

    # Collect data points for visualization
    train_indices = set(X_train.index)
    data_points = []
    for idx, row in df.iterrows():
        split = "train" if idx in train_indices else "test"
        data_points.append({
            "id": int(idx),
            "weight": float(row["Weight"]),
            "height": float(row["Height"]),
            "split": split
        })

    # Generate regression line curve points
    min_w = float(df["Weight"].min() - 10)
    max_w = float(df["Weight"].max() + 15)
    line_weights = np.linspace(min_w, max_w, 50)
    line_df = pd.DataFrame({"Weight": line_weights})
    line_weights_scaled = scaler.transform(line_df)
    line_heights = model.predict(line_weights_scaled)

    regression_line = [
        {"weight": round(float(w), 2), "height": round(float(h), 2)}
        for w, h in zip(line_weights, line_heights)
    ]

    metadata = {
        "model_name": "Standardized Linear Regression",
        "description": "Predicts human height (cm) from weight (kg) using Ordinary Least Squares with Z-score standardization.",
        "metrics": {
            "r2": round(r2_test, 4),
            "train_r2": round(r2_train, 4),
            "adjusted_r2": round(adj_r2_test, 4),
            "mae": round(mae_test, 2),
            "mse": round(mse_test, 2),
            "rmse": round(rmse_test, 2),
            "pearson_r": round(pearson_r, 4),
        },
        "parameters": {
            "slope": round(slope, 4),
            "intercept": round(intercept, 4),
            "scaler_mean": round(mean_weight, 4),
            "scaler_scale": round(scale_weight, 4),
            "formula_latex": f"Height = {intercept:.2f} + {slope:.2f} \\times \\left(\\frac{{\\text{{Weight}} - {mean_weight:.2f}}}{{{scale_weight:.2f}}}\\right)",
            "formula_simplified": f"Height = {intercept - (slope * mean_weight / scale_weight):.2f} + {slope / scale_weight:.4f} * Weight"
        },
        "dataset_summary": {
            "total_samples": len(df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "min_weight": float(df["Weight"].min()),
            "max_weight": float(df["Weight"].max()),
            "min_height": float(df["Height"].min()),
            "max_height": float(df["Height"].max()),
            "weight_mean": round(float(df["Weight"].mean()), 2),
            "weight_std": round(float(df["Weight"].std()), 2),
            "height_mean": round(float(df["Height"].mean()), 2),
            "height_std": round(float(df["Height"].std()), 2),
        },
        "data_points": data_points,
        "regression_line": regression_line
    }

    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nArtifacts saved successfully in {artifacts_dir}")
    print(f"- {scaler_file.name}")
    print(f"- {model_file.name}")
    print(f"- {metadata_file.name}")


if __name__ == "__main__":
    train_model()
