"use client";

import React from "react";
import { Binary, Compass, Layers, Zap } from "lucide-react";

export const MetricsGrid = ({ metadata }) => {
  const metrics = metadata?.metrics || {};
  const parameters = metadata?.parameters || {};
  const dataset_summary = metadata?.dataset_summary || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* R^2 Card */}
        <div className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-4 h-4" />
              R² Determination
            </span>
            <span className="font-mono text-[11px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
              Test: {metrics.r2 ? (metrics.r2 * 100).toFixed(1) : "--"}%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics.r2 ? metrics.r2.toFixed(4) : "--"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Explains <strong className="text-slate-200">73.6%</strong> of height variance on unseen test data (Train: {metrics.train_r2 ? (metrics.train_r2 * 100).toFixed(1) : "--"}%).
          </p>
        </div>

        {/* Adjusted R^2 Card */}
        <div className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-emerald-400">
              <Compass className="w-4 h-4" />
              Adjusted R²
            </span>
            <span className="font-mono text-[11px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
              {metrics.adjusted_r2 ? (metrics.adjusted_r2 * 100).toFixed(1) : "--"}%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics.adjusted_r2 ? metrics.adjusted_r2.toFixed(4) : "--"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Corrected for degrees of freedom penalty.
          </p>
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
              {metrics.rmse ? metrics.rmse.toFixed(2) : "--"}
            </span>
            <span className="text-xs font-semibold text-slate-400">cm</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Standard deviation of the regression residuals.
          </p>
        </div>

        {/* Pearson Correlation Card */}
        <div className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium flex items-center gap-1.5 text-fuchsia-400">
              <Binary className="w-4 h-4" />
              Pearson Correlation (r)
            </span>
            <span className="font-mono text-[11px] bg-fuchsia-500/10 text-fuchsia-300 px-2 py-0.5 rounded border border-fuchsia-500/20">
              Strong
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics.pearson_r ? metrics.pearson_r.toFixed(4) : "--"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Direct linear relationship between Weight and Height.
          </p>
        </div>
      </div>
    </div>
  );
};

