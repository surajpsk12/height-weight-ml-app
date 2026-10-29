"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  Terminal,
} from "lucide-react";

export const TechDetailsDrawer = ({ metadata, onOpenMathModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const metrics = metadata?.metrics || {};
  const parameters = metadata?.parameters || {};

  return (
    <div className="w-full glass-panel rounded-2xl border border-slate-800/80 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔬 Under the Hood: Data Science & Model Metrics</span>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                For Reviewers & Engineers
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Scikit-Learn Linear Regression • StandardScaler • R² Score • REST API Specs
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400">
          <span>{isOpen ? "Hide Details" : "View Technical Details"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">R² Variance (Test)</span>
              <span className="text-xl font-bold font-mono text-cyan-400">
                {metrics.r2 ? (metrics.r2 * 100).toFixed(1) : "--"}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Train: {metrics.train_r2 ? (metrics.train_r2 * 100).toFixed(1) : "--"}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Adjusted R²</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {metrics.adjusted_r2 ? (metrics.adjusted_r2 * 100).toFixed(1) : "--"}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Penalty corrected</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">RMSE Error</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {metrics.rmse ? metrics.rmse.toFixed(2) : "--"} cm
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                MAE: {metrics.mae ? metrics.mae.toFixed(2) : "--"} cm
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Pearson Correlation (r)</span>
              <span className="text-xl font-bold font-mono text-fuchsia-400">
                {metrics.pearson_r ? metrics.pearson_r.toFixed(4) : "--"}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Extremely strong direct link</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-300">
                Mathematical Model Equations
              </span>
              <div className="font-mono text-xs text-cyan-300">
                Height (cm) = {parameters.intercept?.toFixed(2) || "156.47"} + {parameters.slope?.toFixed(2) || "17.30"} × [ (Weight - {parameters.scaler_mean?.toFixed(2) || "72.47"}) / {parameters.scaler_scale?.toFixed(2) || "16.51"} ]
              </div>
              <div className="font-mono text-[11px] text-slate-400">
                Unscaled: {parameters.formula_simplified || "Height = 80.53 + 1.0479 * Weight"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenMathModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition"
              >
                Detailed Math Breakdown
              </button>

              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Swagger Docs</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

