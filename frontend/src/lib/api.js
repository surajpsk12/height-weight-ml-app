import fallbackMetadata from "../data/model_metadata.json";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function cmToFtInches(cm) {
  const totalInches = cm / 2.54;
  let feet = Math.floor(totalInches / 12);
  let inches = totalInches % 12;
  if (Math.round(inches * 10) / 10 === 12.0) {
    feet += 1;
    inches = 0.0;
  }
  return `${feet} ft ${inches.toFixed(1)} in`;
}

export function ftInchesToCm(feet, inches) {
  return Number(((feet * 12 + inches) * 2.54).toFixed(1));
}

export function kgToLbs(kg) {
  return Number((kg * 2.20462).toFixed(1));
}

export function lbsToKg(lbs) {
  return Number((lbs / 2.20462).toFixed(1));
}

// Fallback Height Calculation (Weight -> Height)
export function fallbackPredictHeight(weightKg) {
  const meta = fallbackMetadata;
  const params = meta.weight_to_height?.parameters || meta.parameters;
  const mae = meta.weight_to_height?.metrics?.mae || meta.metrics?.mae || 9.67;

  const z = (weightKg - params.scaler_mean) / params.scaler_scale;
  const predCm = params.intercept + params.slope * z;
  const minCm = Number((predCm - mae).toFixed(1));
  const maxCm = Number((predCm + mae).toFixed(1));
  const ftIn = cmToFtInches(predCm);

  return {
    input_weight_kg: Number(weightKg.toFixed(1)),
    input_weight_lbs: kgToLbs(weightKg),
    predicted_height_cm: Number(predCm.toFixed(1)),
    predicted_height_ft_in: ftIn,
    typical_range_cm: { min: minCm, max: maxCm },
    typical_range_ft_in: { min: cmToFtInches(minCm), max: cmToFtInches(maxCm) },
    friendly_summary: `For an adult weighing ${weightKg.toFixed(1)} kg (${kgToLbs(weightKg)} lbs), the expected height is around ${ftIn} (${predCm.toFixed(1)} cm).`,
    z_score: Number(z.toFixed(4)),
  };
}

// Fallback Weight Calculation (Height -> Weight)
export function fallbackPredictWeight(heightCm) {
  const meta = fallbackMetadata;
  const h2w = meta.height_to_weight?.parameters || {
    slope: 15.84,
    intercept: 72.47,
    scaler_mean: 156.47,
    scaler_scale: 18.03,
  };
  const mae = meta.height_to_weight?.metrics?.mae || 8.25;

  const z = (heightCm - h2w.scaler_mean) / h2w.scaler_scale;
  const predKg = h2w.intercept + h2w.slope * z;
  const predLbs = kgToLbs(predKg);
  const minKg = Number((predKg - mae).toFixed(1));
  const maxKg = Number((predKg + mae).toFixed(1));

  return {
    input_height_cm: Number(heightCm.toFixed(1)),
    input_height_ft_in: cmToFtInches(heightCm),
    predicted_weight_kg: Number(predKg.toFixed(1)),
    predicted_weight_lbs: predLbs,
    typical_range_kg: { min: minKg, max: maxKg },
    typical_range_lbs: { min: kgToLbs(minKg), max: kgToLbs(maxKg) },
    friendly_summary: `For an adult measuring ${cmToFtInches(heightCm)} (${heightCm.toFixed(1)} cm), the expected weight is around ${predKg.toFixed(1)} kg (${predLbs} lbs).`,
    z_score: Number(z.toFixed(4)),
  };
}

export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return { isOnline: false };
    const data = await res.json();
    return { isOnline: data.status === "healthy", version: data.version };
  } catch {
    return { isOnline: false };
  }
}

export async function fetchModelMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/metrics`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) throw new Error("Metadata failed");
    return await res.json();
  } catch {
    return fallbackMetadata;
  }
}

export async function predictHeightFromWeight(weightKg) {
  try {
    const res = await fetch(`${API_BASE_URL}/predict/height`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight_kg: weightKg }),
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error("API call failed");
    const data = await res.json();
    return { result: data, source: "api" };
  } catch {
    return { result: fallbackPredictHeight(weightKg), source: "fallback" };
  }
}

export async function predictWeightFromHeight(heightCm) {
  try {
    const res = await fetch(`${API_BASE_URL}/predict/weight`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ height_cm: heightCm }),
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error("API call failed");
    const data = await res.json();
    return { result: data, source: "api" };
  } catch {
    return { result: fallbackPredictWeight(heightCm), source: "fallback" };
  }
}

