"use client";

import React from "react";
import { PredictionResult } from "@/types";
import { ArrowRight, ChevronRight, Gauge, Scale, Sparkles, User } from "lucide-react";

interface PredictorCardProps {
  weight: number;
  onWeightChange: (val: number) => void;
  prediction: PredictionResult | null;
  predictionSource: "api" | "fallback";
  isLoading: boolean;
}

const PRESETS = [48, 60, 75, 90, 105];

export const PredictorCard: React.FC<PredictorCardProps> = ({
  weight,
  onWeightChange,
  prediction,
  predictionSource,
  isLoading,
}) => {
  // Height scale visualization calculations (scale between 110cm and 200cm)
  const minScaleCm = 115;
  const maxScaleCm = 195;
  const currentHeightCm = prediction ? prediction.predicted_height_cm : 160;
  const percentage = Math.min(
    Math.max(((currentHeightCm - minScaleCm) / (maxScaleCm - minScaleCm)) * 100, 5),
    95
  );

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left Side: Controls & Input */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Input Body Weight</h2>
                <p className="text-xs text-slate-400">Select weight to predict expected height</p>
              </div>
            </div>

            {/* Direct Number Input */}
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-750 rounded-xl px-3 py-1.5 focus-within:border-cyan-500 transition">
              <input
                type="number"
                min={20}
                max={250}
                step={0.5}
                value={weight}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) onWeightChange(val);
                }}
                className="w-16 bg-transparent text-right font-mono text-lg font-bold text-cyan-400 focus:outline-none"
              />
              <span className="text-xs font-semibold text-slate-400">kg</span>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>30 kg</span>
              <span className="text-cyan-400 font-semibold">{weight.toFixed(1)} kg</span>
              <span>140 kg</span>
            </div>
            <input
              type="range"
              min={30}
              max={140}
              step={0.5}
              value={weight}
              onChange={(e) => onWeightChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => onWeightChange(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                    weight === p
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                      : "bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60"
                  }`}
                >
                  {p} kg
                </button>
              ))}
            </div>
          </div>

          {/* Prediction Formula Details */}
          {prediction && (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  Standardized Z-Score:
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {prediction.z_score >= 0 ? `+${prediction.z_score}` : prediction.z_score}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
                {prediction.formula_breakdown.z_score_calculation}
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span>Model Engine:</span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {predictionSource === "api" ? "FastAPI Microservice" : "In-Memory OLS Weights"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Prediction Result & Dynamic Visual Scale */}
        <div className="w-full lg:w-72 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between relative shadow-inner">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Predicted Height
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-200">
                {prediction ? prediction.predicted_height_cm.toFixed(1) : "--"}
              </span>
              <span className="text-sm font-semibold text-slate-400 font-mono">cm</span>
            </div>
            <div className="text-base font-semibold text-cyan-400 font-mono flex items-center gap-1.5">
              <span>{prediction ? prediction.predicted_height_ft_in : "--"}</span>
            </div>
          </div>

          {/* Dynamic Height Scale Visualizer */}
          <div className="my-6 relative h-44 flex items-center justify-center bg-slate-950/70 rounded-lg border border-slate-800/60 p-3">
            {/* Height Ruler Ticks */}
            <div className="absolute left-3 top-3 bottom-3 flex flex-col justify-between text-[10px] font-mono text-slate-500">
              <span>195cm</span>
              <span>175cm</span>
              <span>155cm</span>
              <span>135cm</span>
              <span>115cm</span>
            </div>

            {/* Silhouette Graphic that dynamically rises */}
            <div className="relative h-full w-24 flex items-end justify-center pb-2">
              <div
                style={{ height: `${percentage}%` }}
                className="w-12 bg-gradient-to-t from-cyan-500/20 via-emerald-500/40 to-cyan-400 rounded-t-xl relative border-t-2 border-cyan-300 transition-all duration-300 ease-out flex flex-col items-center justify-start pt-1.5"
              >
                <User className="w-5 h-5 text-cyan-200 opacity-90 drop-shadow" />
                {/* Horizontal Indicator Line */}
                <div className="absolute -right-8 top-0 flex items-center space-x-1">
                  <div className="w-4 h-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-900/90 px-1 rounded border border-cyan-500/40">
                    {currentHeightCm.toFixed(0)}cm
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center font-mono">
            {currentHeightCm < 140
              ? "Below Average Range"
              : currentHeightCm > 175
              ? "Above Average Range"
              : "Standard Average Range"}
          </div>
        </div>
      </div>
    </div>
  );
};

