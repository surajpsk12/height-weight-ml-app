"use client";

import React, { useState } from "react";
import { DataPoint, RegressionPoint } from "@/types";
import { Activity, Info } from "lucide-react";

interface RegressionPlotProps {
  dataPoints: DataPoint[];
  regressionLine: RegressionPoint[];
  currentWeight: number;
  currentHeight: number;
  onSelectSample?: (weight: number) => void;
}

export const RegressionPlot: React.FC<RegressionPlotProps> = ({
  dataPoints,
  regressionLine,
  currentWeight,
  currentHeight,
  onSelectSample,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // Chart bounds & padding
  const minX = 35;
  const maxX = 120;
  const minY = 110;
  const maxY = 195;

  const width = 640;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Coordinate transforms
  const scaleX = (x: number) =>
    padding.left + ((x - minX) / (maxX - minX)) * plotWidth;

  const scaleY = (y: number) =>
    padding.top + plotHeight - ((y - minY) / (maxY - minY)) * plotHeight;

  // Build SVG path for regression line
  const linePathD = regressionLine
    .filter((pt) => pt.weight >= minX && pt.weight <= maxX)
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${scaleX(pt.weight)} ${scaleY(pt.height)}`)
    .join(" ");

  // Grid tick intervals
  const xTicks = [40, 60, 80, 100, 120];
  const yTicks = [120, 140, 160, 180];

  // Active prediction marker coordinates
  const activeX = scaleX(currentWeight);
  const activeY = scaleY(currentHeight);

  return (
    <div className="glass-panel rounded-2xl p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">
              Ordinary Least Squares Regression Fit
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Interactive scatter plot with 23 dataset samples & dynamic real-time prediction
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/30" />
            <span className="text-slate-300">Train Data (17)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 ring-2 ring-fuchsia-400/30" />
            <span className="text-slate-300">Test Data (6)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" />
            <span className="text-slate-300">Regression Line</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse border-2 border-slate-900" />
            <span className="text-emerald-400 font-semibold">Active Marker</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="w-full overflow-x-auto">
        <div className="relative min-w-[500px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none overflow-visible"
          >
            <defs>
              <linearGradient id="regLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid */}
            {xTicks.map((tick) => (
              <g key={`x-${tick}`}>
                <line
                  x1={scaleX(tick)}
                  y1={padding.top}
                  x2={scaleX(tick)}
                  y2={padding.top + plotHeight}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                />
                <text
                  x={scaleX(tick)}
                  y={height - 15}
                  textAnchor="middle"
                  className="fill-slate-500 font-mono text-[11px]"
                >
                  {tick}kg
                </text>
              </g>
            ))}

            {yTicks.map((tick) => (
              <g key={`y-${tick}`}>
                <line
                  x1={padding.left}
                  y1={scaleY(tick)}
                  x2={padding.left + plotWidth}
                  y2={scaleY(tick)}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 12}
                  y={scaleY(tick) + 4}
                  textAnchor="end"
                  className="fill-slate-500 font-mono text-[11px]"
                >
                  {tick}cm
                </text>
              </g>
            ))}

            {/* Axis Lines */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + plotHeight}
              stroke="#334155"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top + plotHeight}
              x2={padding.left + plotWidth}
              y2={padding.top + plotHeight}
              stroke="#334155"
              strokeWidth="1.5"
            />

            {/* Axis Titles */}
            <text
              x={padding.left + plotWidth / 2}
              y={height - 2}
              textAnchor="middle"
              className="fill-slate-400 font-medium text-[11px]"
            >
              Body Weight (kg)
            </text>
            <text
              x={-((padding.top + plotHeight) / 2)}
              y={18}
              transform="rotate(-90)"
              textAnchor="middle"
              className="fill-slate-400 font-medium text-[11px]"
            >
              Height (cm)
            </text>

            {/* Fitted Regression Line */}
            {linePathD && (
              <path
                d={linePathD}
                fill="none"
                stroke="url(#regLineGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
              />
            )}

            {/* Data Scatter Points */}
            {dataPoints.map((pt) => {
              const cx = scaleX(pt.weight);
              const cy = scaleY(pt.height);
              const isTrain = pt.split === "train";
              const isHovered = hoveredPoint?.id === pt.id;

              return (
                <g
                  key={pt.id}
                  className="cursor-pointer transition-transform duration-150"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => onSelectSample && onSelectSample(pt.weight)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 7 : 4.5}
                    fill={isTrain ? "#22d3ee" : "#e879f9"}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={11}
                      fill="none"
                      stroke={isTrain ? "#22d3ee" : "#e879f9"}
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}

            {/* Active Real-Time Prediction Marker on Line */}
            {activeX >= padding.left && activeX <= padding.left + plotWidth && (
              <g className="transition-all duration-75">
                {/* Vertical projection guideline */}
                <line
                  x1={activeX}
                  y1={activeY}
                  x2={activeX}
                  y2={padding.top + plotHeight}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
                {/* Horizontal projection guideline */}
                <line
                  x1={padding.left}
                  y1={activeY}
                  x2={activeX}
                  y2={activeY}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
                {/* Outer halo */}
                <circle
                  cx={activeX}
                  cy={activeY}
                  r={12}
                  fill="#10b981"
                  opacity="0.25"
                  className="animate-pulse"
                />
                {/* Inner marker */}
                <circle
                  cx={activeX}
                  cy={activeY}
                  r={6.5}
                  fill="#10b981"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  filter="url(#glow)"
                />
              </g>
            )}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint && (
            <div
              style={{
                left: `${scaleX(hoveredPoint.weight)}px`,
                top: `${scaleY(hoveredPoint.height) - 50}px`,
              }}
              className="absolute pointer-events-none -translate-x-1/2 z-20 bg-slate-900/95 border border-cyan-500/40 px-3 py-1.5 rounded-lg shadow-xl text-xs text-white whitespace-nowrap"
            >
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <span>Sample #{hoveredPoint.id + 1}</span>
                <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                  {hoveredPoint.split}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-300">
                Weight: <strong className="text-white">{hoveredPoint.weight} kg</strong> | Height:{" "}
                <strong className="text-white">{hoveredPoint.height} cm</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 text-[11px]">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Click any sample dot on the plot to test that exact sample weight!
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          Current point: ({currentWeight.toFixed(1)}kg, {currentHeight.toFixed(1)}cm)
        </span>
      </div>
    </div>
  );
};

