"use client";

import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

export const Header = ({
  apiStatus,
  apiVersion = "2.0.0",
  unitSystem,
  onToggleUnitSystem,
  onOpenTechModal,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              BodyScale AI
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Smart Height & Weight Predictor
            </p>
          </div>
        </div>

        {/* Controls: Unit Toggle & Live Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Unit Toggle Button */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-0.5 flex items-center">
            <button
              onClick={() => {
                if (unitSystem !== "metric") onToggleUnitSystem();
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                unitSystem === "metric"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Metric (kg / cm)
            </button>
            <button
              onClick={() => {
                if (unitSystem !== "imperial") onToggleUnitSystem();
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                unitSystem === "imperial"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Imperial (lbs / ft)
            </button>
          </div>

          {/* Status Dot */}
          <div
            title={`FastAPI Service: ${apiStatus === "connected" ? "Live" : "Client Fallback"}`}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-900 border-slate-800 text-slate-300"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus === "connected"
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : "bg-cyan-400"
              }`}
            />
            <span className="hidden sm:inline font-mono">
              {apiStatus === "connected" ? "API Live" : "Smart ML"}
            </span>
          </div>

          {/* Technical Info Trigger */}
          <button
            onClick={onOpenTechModal}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition"
            title="Inspect Machine Learning Model & Formulas"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ML Details</span>
          </button>
        </div>
      </div>
    </header>
  );
};

