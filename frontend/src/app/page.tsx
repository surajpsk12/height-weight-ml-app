"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { PredictorCard } from "@/components/PredictorCard";
import { RegressionPlot } from "@/components/RegressionPlot";
import { MetricsGrid } from "@/components/MetricsGrid";
import { MathModal } from "@/components/MathModal";
import { checkApiHealth, fetchModelMetadata, predictHeight } from "@/lib/api";
import { ModelMetadata, PredictionResult, ApiStatus } from "@/types";
import defaultMetadata from "@/data/model_metadata.json";
import { ArrowUpRight, CheckCircle, Database, GitBranch, Globe, Laptop, Share2 } from "lucide-react";

export default function Home() {
  const [weight, setWeight] = useState<number>(75);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predictionSource, setPredictionSource] = useState<"api" | "fallback">("fallback");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<ModelMetadata>(
    defaultMetadata as unknown as ModelMetadata
  );
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [apiVersion, setApiVersion] = useState<string>("1.0.0");
  const [isMathModalOpen, setIsMathModalOpen] = useState<boolean>(false);

  // Initialize API Health & Metadata
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

  // Update Prediction when weight changes
  const runPrediction = useCallback(async (currentWeight: number) => {
    setIsLoading(true);
    const { result, source } = await predictHeight(currentWeight);
    setPrediction(result);
    setPredictionSource(source);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    runPrediction(weight);
  }, [weight, runPrediction]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        apiStatus={apiStatus}
        apiVersion={apiVersion}
        onOpenMathModal={() => setIsMathModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative py-4 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-transparent border border-cyan-500/20 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Machine Learning Fullstack Production Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
            Human Height Predictor from Body Weight
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            An end-to-end Machine Learning web application utilizing Ordinary Least Squares Linear Regression, Z-Score feature scaling with Scikit-Learn, a validated FastAPI backend, and an interactive Next.js analytics dashboard.
          </p>
        </div>

        {/* Core Interactive Section: Predictor & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Predictor Card (5 cols on lg) */}
          <div className="lg:col-span-5">
            <PredictorCard
              weight={weight}
              onWeightChange={(val) => setWeight(val)}
              prediction={prediction}
              predictionSource={predictionSource}
              isLoading={isLoading}
            />
          </div>

          {/* Dynamic Regression Plot (7 cols on lg) */}
          <div className="lg:col-span-7">
            <RegressionPlot
              dataPoints={metadata.data_points}
              regressionLine={metadata.regression_line}
              currentWeight={weight}
              currentHeight={prediction ? prediction.predicted_height_cm : 160}
              onSelectSample={(selectedWeight) => setWeight(selectedWeight)}
            />
          </div>
        </div>

        {/* Model Performance & Metrics Grid */}
        <section className="pt-4">
          <MetricsGrid metadata={metadata} />
        </section>

        {/* Engineering Highlights / Architecture Cards */}
        <section className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Database className="w-4 h-4" />
              StandardScaler Pipeline
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fitted strictly on the training subset to prevent data leakage. Normalizes weight distributions using mean ($\mu = 72.47$) and standard deviation ($\sigma = 16.51$).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Laptop className="w-4 h-4" />
              FastAPI Async Server
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides robust Pydantic data contract validation, CORS middleware, OpenAPI Swagger interactive testing documentation, and sub-millisecond inference times.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-fuchsia-400 font-semibold text-sm">
              <Globe className="w-4 h-4" />
              Zero-Downtime Fallback
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Next.js UI automatically detects backend availability and switches gracefully between the live REST microservice and client-side OLS execution.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Built for Machine Learning Udemy Project Showcase & LinkedIn Portfolio.
            <div className="text-slate-500 text-[11px] mt-0.5">
              Python 3.13 • Scikit-Learn • FastAPI • Next.js 16 • TailwindCSS
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400">
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
              Swagger Docs
            </a>
          </div>
        </div>
      </footer>

      {/* Formula & Explanation Modal */}
      <MathModal
        isOpen={isMathModalOpen}
        onClose={() => setIsMathModalOpen(false)}
      />
    </div>
  );
}
