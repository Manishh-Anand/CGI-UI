import { ChurnRisk, ClientRecord, FreshnessState, Priority } from '../types';

export const freshnessFor = (updatedAt?: string): FreshnessState => {
  if (!updatedAt) return 'Unknown';
  const age = Date.now() - new Date(updatedAt).getTime();
  if (Number.isNaN(age)) return 'Unknown';
  if (age < 24 * 60 * 60 * 1000) return 'Fresh';
  if (age < 7 * 24 * 60 * 60 * 1000) return 'Aging';
  return 'Stale';
};

export const clientRisk = (client: ClientRecord): { risk: ChurnRisk; reasons: string[]; priority: Priority } => {
  const reasons: string[] = [];
  let score = 0;
  if (client.services.length <= 1) { score += 2; reasons.push('Single-service concentration'); }
  if (client.yoyGrowth < 0) { score += 1; reasons.push('Year-over-year revenue decline'); }
  if (client.healthScore < 65) { score += 2; reasons.push('Health score below 65'); }
  if (client.competitorExposure && client.competitorExposure !== 'Low') { score += 1; reasons.push('Competitive exposure'); }
  const risk: ChurnRisk = score >= 4 ? 'High' : score >= 2 ? 'Medium' : 'Low';
  return { risk, reasons, priority: risk === 'High' ? 'P0' : risk === 'Medium' ? 'P1' : 'P2' };
};

export const metricComparison = (value: number, baseline: number, suffix = '%') => {
  if (!Number.isFinite(value) || !Number.isFinite(baseline) || baseline === 0) return 'Comparison unavailable';
  const delta = ((value - baseline) / Math.abs(baseline)) * 100;
  return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}${suffix} vs benchmark`;
};

export const validateMetric = (value: number, min = 0, max?: number) => Number.isFinite(value) && value >= min && (max === undefined || value <= max);
