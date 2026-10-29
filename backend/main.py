"""
FastAPI Production API for Height-Weight ML Predictor.
User-friendly bidirectional prediction: Weight -> Height and Height -> Weight.
"""

from contextlib import asynccontextmanager
import json
from pathlib import Path
from typing import Dict, Any, Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pydantic import BaseModel, Field

# Base directories
BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"

artifacts: Dict[str, Any] = {}


def load_artifacts():
    """Ensure artifacts exist or train if missing, then load into memory."""
    req_files = [
        ARTIFACTS_DIR / "scaler_w.joblib",
        ARTIFACTS_DIR / "model_w2h.joblib",
        ARTIFACTS_DIR / "scaler_h.joblib",
        ARTIFACTS_DIR / "model_h2w.joblib",
        ARTIFACTS_DIR / "model_metadata.json",
    ]
    if not all(p.exists() for p in req_files):
        print("Artifacts missing or incomplete! Running training pipeline...")
        from train import train_models
        train_models()

    artifacts["scaler_w"] = joblib.load(ARTIFACTS_DIR / "scaler_w.joblib")
    artifacts["model_w2h"] = joblib.load(ARTIFACTS_DIR / "model_w2h.joblib")
    artifacts["scaler_h"] = joblib.load(ARTIFACTS_DIR / "scaler_h.joblib")
    artifacts["model_h2w"] = joblib.load(ARTIFACTS_DIR / "model_h2w.joblib")

    # Compatibility aliases
    artifacts["scaler"] = artifacts["scaler_w"]
    artifacts["model"] = artifacts["model_w2h"]

    with open(ARTIFACTS_DIR / "model_metadata.json", "r", encoding="utf-8") as f:
        artifacts["metadata"] = json.load(f)
    print("Bidirectional models and scalers loaded successfully.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_artifacts()
    yield
    artifacts.clear()


app = FastAPI(
    title="Height-Weight ML Predictor API",
    description="User-friendly bidirectional Machine Learning API predicting human Height from Weight and Weight from Height.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Helper Functions ---

def cm_to_ft_inches(cm: float) -> str:
    total_inches = cm / 2.54
    feet = int(total_inches // 12)
    inches = total_inches % 12
    if round(inches, 1) == 12.0:
        feet += 1
        inches = 0.0
    return f"{feet} ft {inches:.1f} in"


def kg_to_lbs(kg: float) -> float:
    return round(kg * 2.20462, 1)


# --- Schemas ---

class PredictHeightRequest(BaseModel):
    weight_kg: float = Field(..., ge=20.0, le=250.0, description="Weight in kilograms (kg)", examples=[75.0])


class PredictHeightResponse(BaseModel):
    input_weight_kg: float
    input_weight_lbs: float
    predicted_height_cm: float
    predicted_height_ft_in: str
    typical_range_cm: Dict[str, float]
    typical_range_ft_in: Dict[str, str]
    friendly_summary: str
    z_score: float


class PredictWeightRequest(BaseModel):
    height_cm: float = Field(..., ge=100.0, le=240.0, description="Height in centimeters (cm)", examples=[175.0])


class PredictWeightResponse(BaseModel):
    input_height_cm: float
    input_height_ft_in: str
    predicted_weight_kg: float
    predicted_weight_lbs: float
    typical_range_kg: Dict[str, float]
    typical_range_lbs: Dict[str, float]
    friendly_summary: str
    z_score: float


# Legacy schema support
class LegacyPredictRequest(BaseModel):
    weight: float = Field(..., ge=20.0, le=300.0)


# --- API Endpoints ---

@app.get("/", tags=["General"])
def root():
    return {
        "name": "Height-Weight ML Predictor API",
        "version": "2.0.0",
        "message": "Welcome! Predict height from weight or weight from height with machine learning.",
        "endpoints": {
            "predict_height": "/predict/height (POST)",
            "predict_weight": "/predict/weight (POST)",
            "metrics": "/metrics (GET)",
            "health": "/health (GET)",
            "docs": "/docs"
        }
    }


@app.get("/health", tags=["General"])
def health_check():
    model_ready = "model_w2h" in artifacts and "model_h2w" in artifacts
    return {
        "status": "healthy" if model_ready else "degraded",
        "service": "height-weight-ml-api",
        "version": "2.0.0",
        "model_loaded": model_ready
    }


@app.get("/metrics", tags=["Machine Learning"])
def get_metrics():
    if "metadata" not in artifacts:
        raise HTTPException(status_code=503, detail="Model metadata not loaded.")
    return artifacts["metadata"]


@app.post("/predict/height", response_model=PredictHeightResponse, tags=["Predictions"])
def predict_height(payload: PredictHeightRequest):
    """Predict height in cm and ft/in given weight in kg."""
    scaler = artifacts["scaler_w"]
    model = artifacts["model_w2h"]

    w = payload.weight_kg
    scaled_w = scaler.transform(pd.DataFrame({"Weight": [w]}))[0][0]
    pred_h_cm = float(model.predict([[scaled_w]])[0])

    mae = artifacts["metadata"]["weight_to_height"]["metrics"]["mae"]
    min_h = round(pred_h_cm - mae, 1)
    max_h = round(pred_h_cm + mae, 1)

    ft_in = cm_to_ft_inches(pred_h_cm)

    return PredictHeightResponse(
        input_weight_kg=round(w, 1),
        input_weight_lbs=kg_to_lbs(w),
        predicted_height_cm=round(pred_h_cm, 1),
        predicted_height_ft_in=ft_in,
        typical_range_cm={"min": min_h, "max": max_h},
        typical_range_ft_in={"min": cm_to_ft_inches(min_h), "max": cm_to_ft_inches(max_h)},
        friendly_summary=f"For someone weighing {w:.1f} kg ({kg_to_lbs(w):.1f} lbs), expected height is approximately {ft_in} ({pred_h_cm:.1f} cm).",
        z_score=round(float(scaled_w), 4)
    )


@app.post("/predict/weight", response_model=PredictWeightResponse, tags=["Predictions"])
def predict_weight(payload: PredictWeightRequest):
    """Predict weight in kg and lbs given height in cm."""
    scaler = artifacts["scaler_h"]
    model = artifacts["model_h2w"]

    h = payload.height_cm
    scaled_h = scaler.transform(pd.DataFrame({"Height": [h]}))[0][0]
    pred_w_kg = float(model.predict([[scaled_h]])[0])
    pred_w_lbs = kg_to_lbs(pred_w_kg)

    mae = artifacts["metadata"]["height_to_weight"]["metrics"]["mae"]
    min_w = round(pred_w_kg - mae, 1)
    max_w = round(pred_w_kg + mae, 1)

    return PredictWeightResponse(
        input_height_cm=round(h, 1),
        input_height_ft_in=cm_to_ft_inches(h),
        predicted_weight_kg=round(pred_w_kg, 1),
        predicted_weight_lbs=pred_w_lbs,
        typical_range_kg={"min": min_w, "max": max_w},
        typical_range_lbs={"min": kg_to_lbs(min_w), "max": kg_to_lbs(max_w)},
        friendly_summary=f"For someone measuring {cm_to_ft_inches(h)} ({h:.1f} cm), expected body weight is approximately {pred_w_kg:.1f} kg ({pred_w_lbs:.1f} lbs).",
        z_score=round(float(scaled_h), 4)
    )


# Backward-compatible endpoint for existing consumers
@app.post("/predict", tags=["Legacy"])
def predict_legacy(payload: LegacyPredictRequest):
    scaler = artifacts["scaler_w"]
    model = artifacts["model_w2h"]
    w = payload.weight
    scaled_w = scaler.transform(pd.DataFrame({"Weight": [w]}))[0][0]
    pred_cm = float(model.predict([[scaled_w]])[0])

    meta_params = artifacts["metadata"]["parameters"]
    mu = meta_params["scaler_mean"]
    sigma = meta_params["scaler_scale"]
    slope = meta_params["slope"]
    intercept = meta_params["intercept"]

    return {
        "input_weight_kg": round(w, 2),
        "predicted_height_cm": round(pred_cm, 2),
        "predicted_height_ft_in": cm_to_ft_inches(pred_cm),
        "z_score": round(float(scaled_w), 4),
        "formula_breakdown": {
            "z_score_formula": "Z = (Weight - mu) / sigma",
            "z_score_calculation": f"Z = ({w:.2f} - {mu:.2f}) / {sigma:.2f} = {scaled_w:.4f}",
            "prediction_formula": "Height = Intercept + Slope * Z",
            "prediction_calculation": f"Height = {intercept:.2f} + ({slope:.2f} * {scaled_w:.4f}) = {pred_cm:.2f} cm"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
