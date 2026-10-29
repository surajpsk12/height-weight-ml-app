export interface FormulaBreakdown {
  z_score_formula: string;
  z_score_calculation: string;
  prediction_formula: string;
  prediction_calculation: string;
}

export interface PredictionResult {
  input_weight_kg: number;
  predicted_height_cm: number;
  predicted_height_ft_in: string;
  z_score: number;
  formula_breakdown: FormulaBreakdown;
}

export interface DataPoint {
  id: number;
  weight: number;
  height: number;
  split: "train" | "test";
}

export interface RegressionPoint {
  weight: number;
  height: number;
}

export interface ModelMetadata {
  model_name: string;
  description: string;
  metrics: {
    r2: number;
    train_r2: number;
    adjusted_r2: number;
    mae: number;
    mse: number;
    rmse: number;
    pearson_r: number;
  };
  parameters: {
    slope: number;
    intercept: number;
    scaler_mean: number;
    scaler_scale: number;
    formula_latex: string;
    formula_simplified: string;
  };
  dataset_summary: {
    total_samples: number;
    train_samples: number;
    test_samples: number;
    min_weight: number;
    max_weight: number;
    min_height: number;
    max_height: number;
    weight_mean: number;
    weight_std: number;
    height_mean: number;
    height_std: number;
  };
  data_points: DataPoint[];
  regression_line: RegressionPoint[];
}

export type ApiStatus = "checking" | "connected" | "offline";

