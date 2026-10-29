import "./globals.css";

export const metadata = {
  title: "BodyScale AI | Height & Weight Estimator",
  description: "Bidirectional machine learning predictor between body weight and height using Scikit-Learn, FastAPI, and Next.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#07090e]">{children}</body>
    </html>
  );
}

