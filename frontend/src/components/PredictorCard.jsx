"use client";

import React from "react";
import { kgToLbs, lbsToKg, cmToFtInches } from "@/lib/api";
import {
  CheckCircle2,
  Minus,
  Plus,
  Ruler,
  Scale,
  Sparkles,
} from "lucide-react";

const WEIGHT_PRESETS_METRIC = [50, 65, 75, 85, 100];
const WEIGHT_PRESETS_IMPERIAL = [110, 145, 165, 185, 220];

const HEIGHT_PRESETS_METRIC = [155, 165, 175, 185, 195];
const HEIGHT_PRESETS_IMPERIAL = [
  { label: '5\' 1"', cm: 155 },
  { label: '5\' 5"', cm: 165 },
  { label: '5\' 9"', cm: 175 },
  { label: '6\' 1"', cm: 185 },
  { label: '6\' 5"', cm: 195 },
];

export const PredictorCard = ({
  mode,
  onModeChange,
  unitSystem,
  weightKg,
  onWeightKgChange,
  heightCm,
  onHeightCmChange,
  heightResult,
  weightResult,
}) => {
  const isWeightToHeight = mode === "weight_to_height";

  const currentHeightCm = isWeightToHeight
    ? heightResult?.predicted_height_cm || 160
    : heightCm;
  const avatarPercentage = Math.min(
    Math.max(((currentHeightCm - 115) / (200 - 115)) * 100, 10),
    95
  );

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-800/90 shadow-2xl">
      {/* Background glow accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mode Selector Tabs */}
      <div className="relative z-10 grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-8">
        <button
          onClick={() => onModeChange("weight_to_height")}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            isWeightToHeight
              ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Scale className="w-4 h-4 shrink-0" />
          <span>Enter Weight → Predict Height</span>
        </button>

        <button
          onClick={() => onModeChange("height_to_weight")}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            !isWeightToHeight
              ? "bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Ruler className="w-4 h-4 shrink-0" />
          <span>Enter Height → Predict Weight</span>
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              {isWeightToHeight ? "Step 1: Your Body Weight" : "Step 1: Your Height"}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {isWeightToHeight ? "How much do you weigh?" : "How tall are you?"}
            </h3>
          </div>

          {/* Stepper + Number Display */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <button
              onClick={() => {
                if (isWeightToHeight) {
                  onWeightKgChange(Math.max(weightKg - (unitSystem === "imperial" ? 0.45 : 1), 25));
                } else {
                  onHeightCmChange(Math.max(heightCm - 1, 110));
                }
              }}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="text-center">
              {isWeightToHeight ? (
                <div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {unitSystem === "metric" ? weightKg.toFixed(1) : kgToLbs(weightKg)}
                    </span>
                    <span className="text-sm font-semibold text-cyan-400">
                      {unitSystem === "metric" ? "kg" : "lbs"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    ≈ {unitSystem === "metric" ? `${kgToLbs(weightKg)} lbs` : `${weightKg.toFixed(1)} kg`}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {unitSystem === "metric" ? heightCm.toFixed(1) : cmToFtInches(heightCm)}
                    </span>
                    {unitSystem === "metric" && (
                      <span className="text-sm font-semibold text-cyan-400">cm</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    ≈ {unitSystem === "metric" ? cmToFtInches(heightCm) : `${heightCm.toFixed(1)} cm`}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (isWeightToHeight) {
                  onWeightKgChange(Math.min(weightKg + (unitSystem === "imperial" ? 0.45 : 1), 200));
                } else {
                  onHeightCmChange(Math.min(heightCm + 1, 220));
                }
              }}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Smooth Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={isWeightToHeight ? 35 : 120}
              max={isWeightToHeight ? 135 : 210}
              step={0.5}
              value={isWeightToHeight ? weightKg : heightCm}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (isWeightToHeight) onWeightKgChange(val);
                else onHeightCmChange(val);
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono px-1">
              <span>{isWeightToHeight ? (unitSystem === "metric" ? "35 kg" : "77 lbs") : (unitSystem === "metric" ? "120 cm" : "3' 11\"")}</span>
              <span className="text-slate-400 font-sans">Slide to adjust</span>
              <span>{isWeightToHeight ? (unitSystem === "metric" ? "135 kg" : "297 lbs") : (unitSystem === "metric" ? "210 cm" : "6' 11\"")}</span>
            </div>
          </div>

          {/* Quick Choice Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Quick Selections
            </span>
            <div className="flex flex-wrap gap-2">
              {isWeightToHeight ? (
                unitSystem === "metric" ? (
                  WEIGHT_PRESETS_METRIC.map((p) => (
                    <button
                      key={p}
                      onClick={() => onWeightKgChange(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        Math.round(weightKg) === p
                          ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                      }`}
                    >
                      {p} kg
                    </button>
                  ))
                ) : (
                  WEIGHT_PRESETS_IMPERIAL.map((p) => (
                    <button
                      key={p}
                      onClick={() => onWeightKgChange(lbsToKg(p))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        Math.round(kgToLbs(weightKg)) === p
                          ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25"
                          : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                      }`}
                    >
                      {p} lbs
                    </button>
                  ))
                )
              ) : unitSystem === "metric" ? (
                HEIGHT_PRESETS_METRIC.map((p) => (
                  <button
                    key={p}
                    onClick={() => onHeightCmChange(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      Math.round(heightCm) === p
                        ? "bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/25"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    }`}
                  >
                    {p} cm
                  </button>
                ))
              ) : (
                HEIGHT_PRESETS_IMPERIAL.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => onHeightCmChange(p.cm)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      Math.round(heightCm) === p.cm
                        ? "bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/25"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    }`}
                  >
                    {p.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: The Result Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative shadow-xl shadow-cyan-950/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Predicted Result
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Machine Learning Estimate
              </span>
            </div>

            {/* Big Main Answer Display */}
            {isWeightToHeight ? (
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-emerald-300 tracking-tight">
                  {unitSystem === "imperial"
                    ? heightResult?.predicted_height_ft_in
                    : `${heightResult?.predicted_height_cm?.toFixed(1) || "--"} cm`}
                </div>
                <div className="text-sm font-semibold text-slate-400 font-mono">
                  {unitSystem === "imperial"
                    ? `(${heightResult?.predicted_height_cm?.toFixed(1) || "--"} cm)`
                    : `(${heightResult?.predicted_height_ft_in || "--"})`}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-cyan-300 tracking-tight">
                  {unitSystem === "imperial"
                    ? `${weightResult?.predicted_weight_lbs?.toFixed(1) || "--"} lbs`
                    : `${weightResult?.predicted_weight_kg?.toFixed(1) || "--"} kg`}
                </div>
                <div className="text-sm font-semibold text-slate-400 font-mono">
                  {unitSystem === "imperial"
                    ? `(${weightResult?.predicted_weight_kg?.toFixed(1) || "--"} kg)`
                    : `(${weightResult?.predicted_weight_lbs?.toFixed(1) || "--"} lbs)`}
                </div>
              </div>
            )}

            {/* Typical Expected Range */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">Typical & Common Range:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {isWeightToHeight
                    ? unitSystem === "imperial"
                      ? `${heightResult?.typical_range_ft_in?.min || "--"} – ${heightResult?.typical_range_ft_in?.max || "--"}`
                      : `${heightResult?.typical_range_cm?.min || "--"} – ${heightResult?.typical_range_cm?.max || "--"} cm`
                    : unitSystem === "imperial"
                    ? `${weightResult?.typical_range_lbs?.min || "--"} – ${weightResult?.typical_range_lbs?.max || "--"} lbs`
                    : `${weightResult?.typical_range_kg?.min || "--"} – ${weightResult?.typical_range_kg?.max || "--"} kg`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isWeightToHeight ? heightResult?.friendly_summary : weightResult?.friendly_summary}
              </p>
            </div>
          </div>

          {/* Silhouette Scale */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative h-16 w-8 bg-slate-950 rounded-lg border border-slate-800 flex items-end justify-center p-1 overflow-hidden">
                <div
                  style={{ height: `${avatarPercentage}%` }}
                  className="w-full bg-gradient-to-t from-cyan-500 to-emerald-400 rounded transition-all duration-300"
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Body Scale</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {currentHeightCm < 155
                    ? "Compact Height Frame"
                    : currentHeightCm > 180
                    ? "Tall Height Frame"
                    : "Standard Average Frame"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Instant Output</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

