import "server-only";

import * as ss from "simple-statistics";

export interface DescriptiveStats {
  count: number;
  mean: number;
  median: number;
  mode: number;
  standardDeviation: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  skewness: number;
  variance: number;
}

export interface ForecastResult {
  historical: { period: string; value: number }[];
  forecast: { period: string; value: number; lower: number; upper: number }[];
  trend: { slope: number; intercept: number };
  seasonalIndices: number[];
  mape: number;
}

export interface ElasticityResult {
  elasticity: number;
  rSquared: number;
  intercept: number;
  sampleSize: number;
  interpretation: string;
}

export function computeDescriptiveStats(values: number[]): DescriptiveStats {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    count: values.length,
    mean: ss.mean(values),
    median: ss.median(sorted),
    mode: ss.mode(values),
    standardDeviation: ss.standardDeviation(values),
    min: ss.min(values),
    max: ss.max(values),
    q1: ss.quantile(sorted, 0.25),
    q3: ss.quantile(sorted, 0.75),
    skewness: ss.sampleSkewness(values),
    variance: ss.variance(values),
  };
}

export function demandForecast(
  data: { period: string; value: number }[],
  horizonPeriods: number = 12,
  seasonLength: number = 52
): ForecastResult {
  const values = data.map((d) => d.value);
  const n = values.length;

  // Compute trend via linear regression
  const points: [number, number][] = values.map((v, i) => [i, v]);
  const regression = ss.linearRegression(points);
  const trendLine = ss.linearRegressionLine(regression);

  // Detrend
  const detrended = values.map((v, i) => v - trendLine(i));

  // Compute seasonal indices (if enough data)
  const effectiveSeasonLength = Math.min(seasonLength, Math.floor(n / 2));
  const seasonalIndices: number[] = new Array(effectiveSeasonLength).fill(0);

  if (n >= effectiveSeasonLength * 2) {
    const counts = new Array(effectiveSeasonLength).fill(0);
    for (let i = 0; i < n; i++) {
      const idx = i % effectiveSeasonLength;
      seasonalIndices[idx] += detrended[i];
      counts[idx]++;
    }
    for (let i = 0; i < effectiveSeasonLength; i++) {
      seasonalIndices[i] = counts[i] > 0 ? seasonalIndices[i] / counts[i] : 0;
    }
  }

  // Compute MAPE on fitted values
  let mapeSum = 0;
  let mapeCount = 0;
  for (let i = 0; i < n; i++) {
    const fitted = trendLine(i) + seasonalIndices[i % effectiveSeasonLength];
    if (values[i] !== 0) {
      mapeSum += Math.abs((values[i] - fitted) / values[i]);
      mapeCount++;
    }
  }
  const mape = mapeCount > 0 ? (mapeSum / mapeCount) * 100 : 0;

  // Standard error for confidence intervals
  const residuals = values.map((v, i) => v - (trendLine(i) + seasonalIndices[i % effectiveSeasonLength]));
  const se = ss.standardDeviation(residuals);

  // Generate forecast
  const forecast: { period: string; value: number; lower: number; upper: number }[] = [];
  for (let i = 0; i < horizonPeriods; i++) {
    const idx = n + i;
    const trendValue = trendLine(idx);
    const seasonal = seasonalIndices[idx % effectiveSeasonLength];
    const predicted = trendValue + seasonal;
    const margin = 1.96 * se * Math.sqrt(1 + (i + 1) / n);

    forecast.push({
      period: `T+${i + 1}`,
      value: Math.max(0, predicted),
      lower: Math.max(0, predicted - margin),
      upper: predicted + margin,
    });
  }

  return {
    historical: data,
    forecast,
    trend: { slope: regression.m, intercept: regression.b },
    seasonalIndices,
    mape,
  };
}

export function priceElasticity(
  priceQuantityPairs: { price: number; quantity: number }[]
): ElasticityResult {
  // Filter valid pairs (positive values only for log-log)
  const valid = priceQuantityPairs.filter((p) => p.price > 0 && p.quantity > 0);

  if (valid.length < 3) {
    return {
      elasticity: 0,
      rSquared: 0,
      intercept: 0,
      sampleSize: valid.length,
      interpretation: "Insufficient data (need at least 3 valid price-quantity pairs)",
    };
  }

  // Log-log regression: ln(Q) = a + b*ln(P)
  const logPairs: [number, number][] = valid.map((p) => [Math.log(p.price), Math.log(p.quantity)]);
  const regression = ss.linearRegression(logPairs);
  const regressionLine = ss.linearRegressionLine(regression);

  // R-squared
  const rSquared = ss.rSquared(logPairs, regressionLine);

  const elasticity = regression.m;

  let interpretation: string;
  if (Math.abs(elasticity) < 0.5) {
    interpretation = "Highly inelastic - demand barely responds to price changes";
  } else if (Math.abs(elasticity) < 1) {
    interpretation = "Inelastic - demand changes less than proportionally to price";
  } else if (Math.abs(elasticity) === 1) {
    interpretation = "Unit elastic - demand changes proportionally to price";
  } else if (Math.abs(elasticity) < 2) {
    interpretation = "Elastic - demand changes more than proportionally to price";
  } else {
    interpretation = "Highly elastic - demand is very sensitive to price changes";
  }

  return {
    elasticity,
    rSquared,
    intercept: regression.b,
    sampleSize: valid.length,
    interpretation,
  };
}
