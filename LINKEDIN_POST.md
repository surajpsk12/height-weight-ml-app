# 📢 Ready-to-Post LinkedIn Showcase Draft

> Copy and paste this directly onto your LinkedIn profile, along with a 15–30 second screen recording of you sliding the weight slider on the interactive web app!

---

```text
🚀 Excited to share my latest Machine Learning project: Building an End-to-End Production Height-Weight Prediction System! 🧠📊

Instead of stopping at a Jupyter Notebook, I wanted to take the foundational principles of Ordinary Least Squares (OLS) Linear Regression and turn them into a full-scale, production-ready system deployed across cloud environments.

Here is what I built from scratch:

🔹 The Machine Learning Core:
• Implemented Linear Regression using Scikit-Learn to model the relationship between human body weight (kg) and height (cm).
• Applied StandardScaler (Z-Score Standardization) strictly fitted on the 75% training split (17 samples) to eliminate Data Leakage into the 25% test set (6 samples).
• Evaluated performance metrics on unseen test data:
  - R² Score: 73.61% variance explained (Train R²: 92.08%)
  - Adjusted R²: 67.01% (penalizing model degrees of freedom)
  - RMSE: 10.72 cm vs MAE: 9.67 cm
  - Pearson Correlation (r): 0.9311 (exceptionally strong direct linear relationship)

🔹 Asynchronous Backend Microservice (FastAPI):
• Engineered high-performance REST endpoints (/predict, /metrics, /health).
• Enforced strict Pydantic payload validation and CORS policy.
• Automated model artifact serialization and loading via Joblib.
• Interactive OpenAPI Swagger documentation for one-click API testing.

🔹 Modern Fullstack Dashboard (Next.js + TailwindCSS + TypeScript):
• Interactive dual input: Slider + real-time numeric sync with preset shortcuts.
• Dual height conversion: Instant metric (cm) and imperial (ft & in) calculations.
• Interactive SVG regression chart: Displays all 23 actual dataset observations (color-coded for Train vs Test) with an active glowing marker that traces along the regression fit line in real-time.
• Dynamic human silhouette scale visualizer.
• Zero-downtime architecture: Built-in mathematical fallback ensures 100% interactive uptime even during backend cold starts.

🛠️ Tech Stack:
Python 3.13 | Scikit-Learn | Pandas | NumPy | FastAPI | Pydantic | Next.js 16 | React 19 | TailwindCSS | JavaScript | Vercel | Render

🔗 Check out the project:
• GitHub Repository: [Insert your GitHub URL here]
• Live Web App: [Insert your Vercel URL here]
• Interactive Swagger API: [Insert your Render / local docs URL here]

Big thanks to the data science community for continuous inspiration. Would love to hear your feedback and thoughts in the comments! 👇

#MachineLearning #DataScience #Python #FastAPI #NextJS #FullStackML #ScikitLearn #WebDevelopment #AI #Portfolio #SoftwareEngineering
```

