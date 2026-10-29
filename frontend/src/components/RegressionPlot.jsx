"use client";

import React, { useState } from "react";
import { cmToFtInches, kgToLbs } from "../lib/api";
import { Info, Users } from "lucide-react";

export const RegressionPlot = ({
  mode,
  unitSystem,
  dataPoints = [],
  regressionLine = [],
  currentWeight = 75,
  currentHeight = 160,
  onSelectSample,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const minX = 35;
  const maxX = 120;
  const minY = 110;
  const maxY = 195;

  const width = 640;
  const height = 340;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (x) =>
    padding.left + ((x - minX) / (maxX - minX)) * plotWidth;

  const scaleY = (y) =>
    padding.top + plotHeight - ((y - minY) / (maxY - minY)) * plotHeight;

  const linePathD = regressionLine
    .filter((pt) => pt.weight >= minX && pt.weight <= maxX)
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${scaleX(pt.weight)} ${scaleY(pt.height)}`)
    .join(" ");

  const xTicks = [40, 60, 80, 100, 120];
  const yTicks = [120, 140, 160, 180];

  const activeX = scaleX(currentWeight);
  const activeY = scaleY(currentHeight);

  return (
    <div className="glass-panel rounded-3xl p-6 relative border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Real Population Survey & Trendline
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            See where you land compared to 23 real surveyed adults
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Surveyed People</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" />
            <span className="text-slate-300">Trendline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse border-2 border-slate-900" />
            <span className="text-emerald-400 font-semibold">You Are Here</span>
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
              <linearGradient id="regGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Grid */}
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
                  {unitSystem === "metric" ? `${tick}kg` : `${kgToLbs(tick)}lbs`}
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
                  x={padding.left - 10}
                  y={scaleY(tick) + 4}
                  textAnchor="end"
                  className="fill-slate-500 font-mono text-[11px]"
                >
                  {unitSystem === "metric" ? `${tick}cm` : cmToFtInches(tick)}
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
              Weight ({unitSystem === "metric" ? "kg" : "lbs"})
            </text>
            <text
              x={-((padding.top + plotHeight) / 2)}
              y={16}
              transform="rotate(-90)"
              textAnchor="middle"
              className="fill-slate-400 font-medium text-[11px]"
            >
              Height ({unitSystem === "metric" ? "cm" : "ft/in"})
            </text>

            {/* Fitted Regression Line */}
            {linePathD && (
              <path
                d={linePathD}
                fill="none"
                stroke="url(#regGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
              />
            )}

            {/* Scatter Dots */}
            {dataPoints.map((pt) => {
              const cx = scaleX(pt.weight);
              const cy = scaleY(pt.height);
              const isHovered = hoveredPoint?.id === pt.id;

              return (
                <g
                  key={pt.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => onSelectSample && onSelectSample(pt.weight, pt.height)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 7 : 5}
                    fill="#22d3ee"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={10}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      opacity="0.7"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}

            {/* Active Marker */}
            {activeX >= padding.left && activeX <= padding.left + plotWidth && (
              <g className="transition-all duration-100">
                <line
                  x1={activeX}
                  y1={activeY}
                  x2={activeX}
                  y2={padding.top + plotHeight}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
                <line
                  x1={padding.left}
                  y1={activeY}
                  x2={activeX}
                  y2={activeY}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
                <circle cx={activeX} cy={activeY} r={14} fill="#10b981" opacity="0.2" className="animate-pulse" />
                <circle cx={activeX} cy={activeY} r={6.5} fill="#10b981" stroke="#0f172a" strokeWidth="2.5" />
              </g>
            )}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div
              style={{
                left: `${scaleX(hoveredPoint.weight)}px`,
                top: `${scaleY(hoveredPoint.height) - 45}px`,
              }}
              className="absolute pointer-events-none -translate-x-1/2 z-20 bg-slate-900/95 border border-cyan-500/50 px-3 py-1.5 rounded-xl shadow-2xl text-xs text-white whitespace-nowrap"
            >
              <div className="font-semibold text-cyan-300">
                Person #{hoveredPoint.id + 1}
              </div>
              <div className="font-mono text-[11px] text-slate-300">
                Weight: {hoveredPoint.weight} kg ({kgToLbs(hoveredPoint.weight)} lbs) | Height:{" "}
                {hoveredPoint.height} cm ({cmToFtInches(hoveredPoint.height)})
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          Tap any dot to load that person&apos;s real measurements!
        </span>
        <span className="font-mono text-[11px] text-emerald-400 font-semibold">
          Current: {currentWeight.toFixed(1)}kg • {currentHeight.toFixed(1)}cm
        </span>
      </div>
    </div>
  );
};

