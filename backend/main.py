"""
FastAPI Production API for Height-Weight ML Predictor.
Provides endpoints for prediction, model metrics, health check, and metadata.
"""

from contextlib import asynccontextmanager
import json
from pathlib import Path
from typing import Dict, Any, List

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field

# Base directories
BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
SCALER_PATH = ARTIFACTS_DIR / "scaler.joblib"
MODEL_PATH = ARTIFACTS_DIR / "model.joblib"
METADATA_PATH = ARTIFACTS_DIR / "model_metadata.json"

# In-memory storage for loaded model & artifacts
artifacts: Dict[str, Any] = {}


def load_artifacts():
    """Ensure artifacts exist or train if missing, then load into memory."""
    if not (SCALER_PATH.exists() and MODEL_PATH.exists() and METADATA_PATH.exists()):
        print("Artifacts missing! Running training pipeline...")
        from train import train_model
        train_model()

    artifacts["scaler"] = joblib.load(SCALER_PATH)
    artifacts["model"] = joblib.load(MODEL_PATH)
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        artifacts["metadata"] = json.load(f)
    print("Model and scaler loaded successfully.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_artifacts()
    yield
    artifacts.clear()


app = FastAPI(
    title="Height-Weight ML Prediction API",
    description="Production Machine Learning API serving an Ordinary Least Squares Regression model with StandardScaler to predict Height from Weight.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request and Response Schemas ---

class PredictRequest(BaseModel):
    weight: float = Field(
        ...,
        ge=20.0,
        le=300.0,
        description="Weight in kilograms (kg) between 20.0 and 300.0",
        examples=[75.0]
    )


class FormulaBreakdown(BaseModel):
    z_score_formula: str
    z_score_calculation: str
    prediction_formula: str
    prediction_calculation: str


class PredictResponse(BaseModel):
    input_weight_kg: float
    predicted_height_cm: float
    predicted_height_ft_in: str
    z_score: float
    formula_breakdown: FormulaBreakdown


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    model_loaded: bool


# --- Helper Functions ---

def cm_to_ft_inches(cm: float) -> str:
    """Converts centimeters to feet and inches format, e.g. '5 ft 6.3 in'."""
    total_inches = cm / 2.54
    feet = int(total_inches // 12)
    inches = total_inches % 12
    if round(inches, 1) == 12.0:
        feet += 1
        inches = 0.0
    return f"{feet} ft {inches:.1f} in"


# --- API Endpoints ---

@app.get("/", tags=["General"])
def root():
    return {
        "name": "Height-Weight ML Prediction API",
        "version": "1.0.0",
        "description": "Production Machine Learning API serving an Ordinary Least Squares Regression model with StandardScaler.",
        "endpoints": {
            "health": "/health",
            "metrics": "/metrics",
            "predict": "/predict (POST)",
            "docs": "/docs"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["General"])
def health_check():
    model_ready = "model" in artifacts and "scaler" in artifacts
    return {
        "status": "healthy" if model_ready else "degraded",
        "service": "height-weight-ml-api",
        "version": "1.0.0",
        "model_loaded": model_ready
    }


@app.get("/metrics", tags=["Machine Learning"])
def get_metrics():
    """Returns model metrics, parameters, and all sample coordinates for charting."""
    if "metadata" not in artifacts:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model metadata is not loaded."
        )
    return artifacts["metadata"]


@app.post("/predict", response_model=PredictResponse, tags=["Machine Learning"])
def predict_height(payload: PredictRequest):
    """
    Predict human height in cm and feet/inches based on weight (kg).
    Computes Z-Score standard scaling and applies trained regression equation.
    """
    if "model" not in artifacts or "scaler" not in artifacts:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model artifacts are not currently loaded."
        )

    scaler = artifacts["scaler"]
    model = artifacts["model"]
    meta_params = artifacts["metadata"]["parameters"]

    w = payload.weight

    # Feature scaling: StandardScaler expects 2D array / DataFrame
    input_df = pd.DataFrame({"Weight": [w]})
    scaled_w = scaler.transform(input_df)[0][0]

    # Predict
    predicted_cm = float(model.predict([[scaled_w]])[0])
    predicted_ft_in = cm_to_ft_inches(predicted_cm)

    mu = meta_params["scaler_mean"]
    sigma = meta_params["scaler_scale"]
    slope = meta_params["slope"]
    intercept = meta_params["intercept"]

    breakdown = FormulaBreakdown(
        z_score_formula="Z = (Weight - mu) / sigma",
        z_score_calculation=f"Z = ({w:.2f} - {mu:.2f}) / {sigma:.2f} = {scaled_w:.4f}",
        prediction_formula="Height = Intercept + Slope * Z",
        prediction_calculation=f"Height = {intercept:.2f} + ({slope:.2f} * {scaled_w:.4f}) = {predicted_cm:.2f} cm"
    )

    return PredictResponse(
        input_weight_kg=round(w, 2),
        predicted_height_cm=round(predicted_cm, 2),
        predicted_height_ft_in=predicted_ft_in,
        z_score=round(float(scaled_w), 4),
        formula_breakdown=breakdown
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

