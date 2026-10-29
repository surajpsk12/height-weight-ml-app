"""
Height-Weight Bidirectional Linear Regression Model Training Pipeline
Trains:
1. Weight -> Height model (StandardScaler on Weight)
2. Height -> Weight model (StandardScaler on Height)
Saves models, scalers, and rich metadata for production API and frontend visualization.
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


def train_models():
    base_dir = Path(__file__).resolve().parent
    repo_root = base_dir.parent
    data_path = repo_root / "data_source_excel" / "height-weight.csv"

    if not data_path.exists():
        data_path = base_dir / "height-weight.csv"

    print(f"Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    print(f"Dataset loaded: {len(df)} records.")

    # 1. Weight -> Height Model
    X_w = df[["Weight"]]
    y_h = df["Height"]

    X_train_w, X_test_w, y_train_h, y_test_h = train_test_split(
        X_w, y_h, test_size=0.25, random_state=42
    )

    scaler_w = StandardScaler()
    X_train_w_scaled = scaler_w.fit_transform(X_train_w)
    X_test_w_scaled = scaler_w.transform(X_test_w)

    model_w2h = LinearRegression()
    model_w2h.fit(X_train_w_scaled, y_train_h)

    y_pred_h_test = model_w2h.predict(X_test_w_scaled)
    y_pred_h_train = model_w2h.predict(X_train_w_scaled)

    mse_h = mean_squared_error(y_test_h, y_pred_h_test)
    rmse_h = float(np.sqrt(mse_h))
    mae_h = float(mean_absolute_error(y_test_h, y_pred_h_test))
    r2_h_test = float(r2_score(y_test_h, y_pred_h_test))
    r2_h_train = float(r2_score(y_train_h, y_pred_h_train))

    n_test = len(y_test_h)
    adj_r2_h = float(1 - ((1 - r2_h_test) * (n_test - 1) / (n_test - 1 - 1)))

    # 2. Height -> Weight Model
    X_h = df[["Height"]]
    y_w = df["Weight"]

    X_train_h, X_test_h, y_train_w, y_test_w = train_test_split(
        X_h, y_w, test_size=0.25, random_state=42
    )

    scaler_h = StandardScaler()
    X_train_h_scaled = scaler_h.fit_transform(X_train_h)
    X_test_h_scaled = scaler_h.transform(X_test_h)

    model_h2w = LinearRegression()
    model_h2w.fit(X_train_h_scaled, y_train_w)

    y_pred_w_test = model_h2w.predict(X_test_h_scaled)
    y_pred_w_train = model_h2w.predict(X_train_h_scaled)

    mse_w = mean_squared_error(y_test_w, y_pred_w_test)
    rmse_w = float(np.sqrt(mse_w))
    mae_w = float(mean_absolute_error(y_test_w, y_pred_w_test))
    r2_w_test = float(r2_score(y_test_w, y_pred_w_test))
    r2_w_train = float(r2_score(y_train_w, y_pred_w_train))
    adj_r2_w = float(1 - ((1 - r2_w_test) * (n_test - 1) / (n_test - 1 - 1)))

    pearson_r = float(df["Weight"].corr(df["Height"]))

    slope_w2h = float(model_w2h.coef_[0])
    intercept_w2h = float(model_w2h.intercept_)
    mean_w = float(scaler_w.mean_[0])
    scale_w = float(scaler_w.scale_[0])

    slope_h2w = float(model_h2w.coef_[0])
    intercept_h2w = float(model_h2w.intercept_)
    mean_h = float(scaler_h.mean_[0])
    scale_h = float(scaler_h.scale_[0])

    print("\n--- Training Results (Weight -> Height) ---")
    print(f"Test R^2: {r2_h_test:.4f}, Test MAE: {mae_h:.2f} cm, RMSE: {rmse_h:.2f} cm")
    print("\n--- Training Results (Height -> Weight) ---")
    print(f"Test R^2: {r2_w_test:.4f}, Test MAE: {mae_w:.2f} kg, RMSE: {rmse_w:.2f} kg")

    artifacts_dir = base_dir / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    # Save models and scalers
    joblib.dump(scaler_w, artifacts_dir / "scaler_w.joblib")
    joblib.dump(model_w2h, artifacts_dir / "model_w2h.joblib")
    joblib.dump(scaler_h, artifacts_dir / "scaler_h.joblib")
    joblib.dump(model_h2w, artifacts_dir / "model_h2w.joblib")

    # Backward compatibility aliases
    joblib.dump(scaler_w, artifacts_dir / "scaler.joblib")
    joblib.dump(model_w2h, artifacts_dir / "model.joblib")

    # Scatter points for plotting
    train_indices = set(X_train_w.index)
    data_points = []
    for idx, row in df.iterrows():
        split = "train" if idx in train_indices else "test"
        data_points.append({
            "id": int(idx),
            "weight": float(row["Weight"]),
            "height": float(row["Height"]),
            "split": split
        })

    # Regression curves
    line_weights = np.linspace(35, 120, 60)
    line_w_scaled = scaler_w.transform(pd.DataFrame({"Weight": line_weights}))
    line_heights = model_w2h.predict(line_w_scaled)

    regression_line_w2h = [
        {"weight": round(float(w), 2), "height": round(float(h), 2)}
        for w, h in zip(line_weights, line_heights)
    ]

    metadata = {
        "model_name": "Bidirectional Human Height & Weight Predictor",
        "description": "User-friendly bidirectional predictor between body weight (kg/lbs) and height (cm/ft-in).",
        "weight_to_height": {
            "metrics": {
                "r2": round(r2_h_test, 4),
                "train_r2": round(r2_h_train, 4),
                "adjusted_r2": round(adj_r2_h, 4),
                "mae": round(mae_h, 2),
                "rmse": round(rmse_h, 2),
            },
            "parameters": {
                "slope": round(slope_w2h, 4),
                "intercept": round(intercept_w2h, 4),
                "scaler_mean": round(mean_w, 4),
                "scaler_scale": round(scale_w, 4),
                "formula_simplified": f"Height (cm) = {intercept_w2h - (slope_w2h * mean_w / scale_w):.2f} + {slope_w2h / scale_w:.4f} * Weight (kg)"
            }
        },
        "height_to_weight": {
            "metrics": {
                "r2": round(r2_w_test, 4),
                "train_r2": round(r2_w_train, 4),
                "adjusted_r2": round(adj_r2_w, 4),
                "mae": round(mae_w, 2),
                "rmse": round(rmse_w, 2),
            },
            "parameters": {
                "slope": round(slope_h2w, 4),
                "intercept": round(intercept_h2w, 4),
                "scaler_mean": round(mean_h, 4),
                "scaler_scale": round(scale_h, 4),
                "formula_simplified": f"Weight (kg) = {intercept_h2w - (slope_h2w * mean_h / scale_h):.2f} + {slope_h2w / scale_h:.4f} * Height (cm)"
            }
        },
        # Top-level metrics maintained for backward compatibility
        "metrics": {
            "r2": round(r2_h_test, 4),
            "train_r2": round(r2_h_train, 4),
            "adjusted_r2": round(adj_r2_h, 4),
            "mae": round(mae_h, 2),
            "mse": round(mse_h, 2),
            "rmse": round(rmse_h, 2),
            "pearson_r": round(pearson_r, 4),
        },
        "parameters": {
            "slope": round(slope_w2h, 4),
            "intercept": round(intercept_w2h, 4),
            "scaler_mean": round(mean_w, 4),
            "scaler_scale": round(scale_w, 4),
            "formula_latex": f"Height = {intercept_w2h:.2f} + {slope_w2h:.2f} \\times \\left(\\frac{{\\text{{Weight}} - {mean_w:.2f}}}{{{scale_w:.2f}}}\\right)",
            "formula_simplified": f"Height = {intercept_w2h - (slope_w2h * mean_w / scale_w):.2f} + {slope_w2h / scale_w:.4f} * Weight"
        },
        "dataset_summary": {
            "total_samples": len(df),
            "train_samples": len(X_train_w),
            "test_samples": len(X_test_w),
            "min_weight": float(df["Weight"].min()),
            "max_weight": float(df["Weight"].max()),
            "min_height": float(df["Height"].min()),
            "max_height": float(df["Height"].max()),
            "weight_mean": round(float(df["Weight"].mean()), 2),
            "height_mean": round(float(df["Height"].mean()), 2),
        },
        "data_points": data_points,
        "regression_line": regression_line_w2h
    }

    metadata_path = artifacts_dir / "model_metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nAll artifacts written to {artifacts_dir}")


if __name__ == "__main__":
    train_models()
