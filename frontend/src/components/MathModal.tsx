"use client";

import React from "react";
import { BookOpen, Check, Code2, Cpu, ShieldCheck, X } from "lucide-react";

interface MathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MathModal: React.FC<MathModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 transition border border-slate-750"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Mathematical Foundation & ML Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Ordinary Least Squares, Feature Standardization, and Metric Evaluation
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300">
          {/* Section 1: Feature Standardization */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
              <Cpu className="w-4 h-4" />
              <h3>1. Feature Scaling (StandardScaler / Z-Score)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardization centers features around a mean ($\mu = 0$) with a unit standard deviation ($\sigma = 1$). In this project:
            </p>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
              Z = (Weight - 72.4706) / 16.5071
            </div>
            <div className="flex items-start gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <strong>Data Leakage Prevention:</strong> The scaler was fitted strictly on the 75% training split (17 samples) and transformed the 25% test split (6 samples) without re-fitting.
              </span>
            </div>
          </div>

          {/* Section 2: Linear Regression Model */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <Code2 className="w-4 h-4" />
              <h3>2. Ordinary Least Squares (OLS) Formulation</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The regression line minimizes the Sum of Squared Residuals (SSR) between actual sample heights and model predictions:
            </p>
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto space-y-1">
              <div>Height = Intercept + (Slope × Z)</div>
              <div className="text-slate-400">Height = 156.4706 + (17.2982 × Z)</div>
              <div className="text-slate-500">Unscaled: Height = 80.53 + 1.0479 × Weight</div>
            </div>
            <p className="text-xs text-slate-400">
              Each standard deviation increase in weight (+16.51 kg) leads to an expected increase of +17.30 cm in human height.
            </p>
          </div>

          {/* Section 3: Metrics Deep Dive */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-amber-400 font-semibold flex items-center gap-2">
              <span>3. Evaluation Metrics Comparison</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-white">R² vs Adjusted R²</span>
                <p className="text-slate-400 mt-1">
                  R² (0.7361) indicates 73.6% of test variance is explained. Adjusted R² (0.6701) penalizes model complexity to prevent false optimism.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-white">MAE vs RMSE</span>
                <p className="text-slate-400 mt-1">
                  MAE (9.67 cm) measures average absolute deviation. RMSE (10.72 cm) squares errors, penalizing occasional large outliers.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Production Architecture */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900/80 border border-cyan-800/40 text-xs">
            <span className="font-semibold text-cyan-300 block mb-1">
              End-to-End Production Pipeline
            </span>
            <p className="text-slate-400">
              <code>height-weight.csv</code> → <code>train.py</code> (StandardScaler + LinearRegression) → Joblib Serialization → FastAPI REST server (Pydantic validation, CORS, Swagger UI) → Next.js React UI.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition shadow-lg shadow-cyan-500/20"
          >
            Got It! Close
          </button>
        </div>
      </div>
    </div>
  );
};

