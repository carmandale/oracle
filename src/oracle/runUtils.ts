import type { OracleResponse, PreviewMode } from './types.js';

export function resolvePreviewMode(value: boolean | string | undefined): PreviewMode | undefined {
  const allowed = new Set<PreviewMode>(['summary', 'json', 'full']);
  if (typeof value === 'string' && value.length > 0) {
    return allowed.has(value as PreviewMode) ? (value as PreviewMode) : 'summary';
  }
  if (value) {
    return 'summary';
  }
  return undefined;
}

export function formatTokenEstimate(value: number, format: (text: string) => string = (text) => text): string {
  if (value >= 1000) {
    const abbreviated = Math.floor(value / 100) / 10; // 4,252 -> 4.2
    const text = `${abbreviated.toFixed(1).replace(/\.0$/, '')}k`;
    return format(text);
  }
  const text = value.toLocaleString();
  return format(text);
}

export function formatTokenValue(value: number, usage: OracleResponse['usage'], index: number): string {
  const estimatedFlag =
    (index === 0 && usage?.input_tokens == null) ||
    (index === 1 && usage?.output_tokens == null) ||
    (index === 2 && usage?.reasoning_tokens == null) ||
    (index === 3 && usage?.total_tokens == null);
  const text = value.toLocaleString();
  return estimatedFlag ? `${text}*` : text;
}
