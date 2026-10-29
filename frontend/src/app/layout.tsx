import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Height-Weight ML Predictor | Production Linear Regression System",
  description: "End-to-End Machine Learning System predicting human height from weight using Scikit-Learn, StandardScaler, FastAPI, and an interactive Next.js dashboard.",
  keywords: ["Machine Learning", "Linear Regression", "FastAPI", "Next.js", "Scikit-Learn", "Portfolio", "Udemy"],
  authors: [{ name: "ML Engineer Portfolio" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#07090e]">{children}</body>
    </html>
  );
}
