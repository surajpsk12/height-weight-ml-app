"use client";

import React from "react";
import { ModelMetadata } from "@/types";
import { BarChart3, Binary, CheckCircle2, Compass, Layers, Zap } from "lucide-react";

interface MetricsGridProps {
  metadata: ModelMetadata;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metadata }) => {
  const { metrics, parameters, dataset_summary } = metadata;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">
            Model Performance & Validation Metrics
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Evaluated on 25% Unseen Test Set
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* R^2 Score Card */}
        <div className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-4 h-4" />
              R² Determination
            </span>
            <span className="font-mono text-[11px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
              Test: {(metrics.r2 * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics.r2.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Explains <strong className="text-slate-200">73.6%</strong> of height variance on unseen test data (Train: {(metrics.train_r2 * 100).toFixed(1)}%).
          </p>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              style={{ width: `${metrics.r2 * 100}%` }}
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full"
            />
          </div>
        </div>

        {/* Adjusted R^2 Card */}
        <div className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-emerald-400">
              <Compass className="w-4 h-4" />
              Adjusted R²
            </span>
            <span className="font-mono text-[11px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
              {(metrics.adjusted_r2 * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics.adjusted_r2.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Corrected for degree-of-freedom penalties, validating the single-feature predictor model.
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              style={{ width: `${metrics.adjusted_r2 * 100}%` }}
              className="bg-emerald-400 h-full rounded-full"
            />
          </div>
        </div>

        {/* RMSE Card */}
        <div className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-amber-400">
              <Layers className="w-4 h-4" />
              Root Mean Squared Error
            </span>
            <span className="font-mono text-[11px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
              RMSE
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics.rmse.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">cm</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Penalizes larger outliers heavily; standard deviation of the regression residuals.
          </p>
          <div className="mt-3 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>MSE: {metrics.mse.toFixed(2)}</span>
            <span>MAE: {metrics.mae.toFixed(2)} cm</span>
          </div>
        </div>

        {/* Pearson Correlation Card */}
        <div className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-fuchsia-400">
              <Binary className="w-4 h-4" />
              Pearson Correlation (r)
            </span>
            <span className="font-mono text-[11px] bg-fuchsia-500/10 text-fuchsia-300 px-2 py-0.5 rounded border border-fuchsia-500/20">
              Very Strong
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics.pearson_r.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Demonstrates an exceptionally strong positive linear relationship between Weight and Height.
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              style={{ width: `${metrics.pearson_r * 100}%` }}
              className="bg-gradient-to-r from-fuchsia-400 to-pink-400 h-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Model Mathematical Equation Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Production Regression Equation
          </div>
          <div className="font-mono text-sm text-cyan-300">
            Height (cm) = {parameters.intercept.toFixed(2)} + {parameters.slope.toFixed(2)} × [ (Weight - {parameters.scaler_mean.toFixed(2)}) / {parameters.scaler_scale.toFixed(2)} ]
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Direct unscaled form: <span className="text-slate-200">{parameters.formula_simplified}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
          <div>
            <div className="text-slate-500">Total Samples</div>
            <div className="text-white font-bold">{dataset_summary.total_samples}</div>
          </div>
          <div>
            <div className="text-slate-500">Train / Test Split</div>
            <div className="text-white font-bold">{dataset_summary.train_samples} / {dataset_summary.test_samples}</div>
          </div>
          <div>
            <div className="text-slate-500">Mean Weight</div>
            <div className="text-white font-bold">{dataset_summary.weight_mean} kg</div>
          </div>
        </div>
      </div>
    </div>
  );
};

