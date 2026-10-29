"use client";

import React from "react";
import { Activity, BookOpen, ExternalLink, Sparkles, Terminal } from "lucide-react";

interface HeaderProps {
  apiStatus: "checking" | "connected" | "offline";
  apiVersion?: string;
  onOpenMathModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus,
  apiVersion = "1.0.0",
  onOpenMathModal,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Height-Weight Predictor
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Linear Regression ML
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Scikit-Learn • StandardScaler • FastAPI • Next.js
            </p>
          </div>
        </div>

        {/* Status & Navigation Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Status Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border bg-slate-900/80 shadow-inner">
            {apiStatus === "checking" && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-300">Checking API...</span>
              </>
            )}
            {apiStatus === "connected" && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-emerald-300 font-mono">FastAPI: Live (v{apiVersion})</span>
              </>
            )}
            {apiStatus === "offline" && (
              <>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-cyan-300 font-mono">Client-Side ML Engine</span>
              </>
            )}
          </div>

          {/* Docs button */}
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Interactive Swagger Documentation"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-750 transition"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Swagger API</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Math & Theory Trigger */}
          <button
            onClick={onOpenMathModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Math & Z-Score</span>
            <span className="sm:hidden">Math</span>
          </button>
        </div>
      </div>
    </header>
  );
};
