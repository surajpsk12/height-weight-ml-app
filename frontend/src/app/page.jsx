"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { PredictorCard } from "@/components/PredictorCard";
import { RegressionPlot } from "@/components/RegressionPlot";
import { TechDetailsDrawer } from "@/components/TechDetailsDrawer";
import { MathModal } from "@/components/MathModal";
import {
  checkApiHealth,
  fetchModelMetadata,
  predictHeightFromWeight,
  predictWeightFromHeight,
} from "@/lib/api";
import defaultMetadata from "@/data/model_metadata.json";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState("weight_to_height");
  const [unitSystem, setUnitSystem] = useState("metric");

  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(175);

  const [heightResult, setHeightResult] = useState(null);
  const [weightResult, setWeightResult] = useState(null);

  const [metadata, setMetadata] = useState(defaultMetadata);
  const [apiStatus, setApiStatus] = useState("checking");
  const [apiVersion, setApiVersion] = useState("2.0.0");
  const [isMathModalOpen, setIsMathModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      const health = await checkApiHealth();
      if (!isMounted) return;

      if (health.isOnline) {
        setApiStatus("connected");
        if (health.version) setApiVersion(health.version);
        const meta = await fetchModelMetadata();
        if (isMounted) setMetadata(meta);
      } else {
        setApiStatus("offline");
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const runWeightToHeight = useCallback(async (w) => {
    const { result } = await predictHeightFromWeight(w);
    setHeightResult(result);
  }, []);

  const runHeightToWeight = useCallback(async (h) => {
    const { result } = await predictWeightFromHeight(h);
    setWeightResult(result);
  }, []);

  useEffect(() => {
    if (mode === "weight_to_height") {
      runWeightToHeight(weightKg);
    } else {
      runHeightToWeight(heightCm);
    }
  }, [mode, weightKg, heightCm, runWeightToHeight, runHeightToWeight]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header
        apiStatus={apiStatus}
        apiVersion={apiVersion}
        unitSystem={unitSystem}
        onToggleUnitSystem={() =>
          setUnitSystem(unitSystem === "metric" ? "imperial" : "metric")
        }
        onOpenTechModal={() => setIsMathModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Body Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find Your Expected Height or Weight
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Choose what you know, move the slider or type your numbers, and instantly see what our machine learning model predicts based on real population measurements.
          </p>
        </div>

        <PredictorCard
          mode={mode}
          onModeChange={(newMode) => setMode(newMode)}
          unitSystem={unitSystem}
          weightKg={weightKg}
          onWeightKgChange={(w) => setWeightKg(w)}
          heightCm={heightCm}
          onHeightCmChange={(h) => setHeightCm(h)}
          heightResult={heightResult}
          weightResult={weightResult}
        />

        <section className="pt-2">
          <RegressionPlot
            mode={mode}
            unitSystem={unitSystem}
            dataPoints={metadata?.data_points || []}
            regressionLine={metadata?.regression_line || []}
            currentWeight={
              mode === "weight_to_height"
                ? weightKg
                : weightResult?.predicted_weight_kg || 75
            }
            currentHeight={
              mode === "weight_to_height"
                ? heightResult?.predicted_height_cm || 160
                : heightCm
            }
            onSelectSample={(sampleWeight, sampleHeight) => {
              if (mode === "weight_to_height") {
                setWeightKg(sampleWeight);
              } else {
                setHeightCm(sampleHeight);
              }
            }}
          />
        </section>

        <section className="pt-2">
          <TechDetailsDrawer
            metadata={metadata}
            onOpenMathModal={() => setIsMathModalOpen(true)}
          />
        </section>
      </main>

      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Built with Scikit-Learn, FastAPI, Next.js, and TailwindCSS.
            <div className="text-slate-500 text-[11px] mt-0.5">
              Portfolio & Educational Project Showcase
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <button
              onClick={() => setIsMathModalOpen(true)}
              className="hover:text-cyan-400 transition"
            >
              Math & Formulas
            </button>
            <span>•</span>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition"
            >
              Swagger API Docs
            </a>
          </div>
        </div>
      </footer>

      <MathModal
        isOpen={isMathModalOpen}
        onClose={() => setIsMathModalOpen(false)}
      />
    </div>
  );
}

