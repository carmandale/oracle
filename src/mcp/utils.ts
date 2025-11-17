import type { RunOracleOptions } from '../oracle.js';
import { normalizeModelOption, inferModelFromLabel, resolveApiModel } from '../cli/options.js';
import { resolveEngine, type EngineMode } from '../cli/engine.js';
import { Launcher } from 'chrome-launcher';

export function mapConsultToRunOptions({
  prompt,
  files,
  model,
  engine,
}: {
  prompt: string;
  files: string[];
  model?: string;
  engine?: EngineMode;
}): { runOptions: RunOracleOptions; resolvedEngine: EngineMode } {
  const resolvedEngine: EngineMode = resolveEngine({ engine, env: process.env });
  const cliModelArg = normalizeModelOption(model) || 'gpt-5-pro';
  const resolvedModel = resolvedEngine === 'browser' ? inferModelFromLabel(cliModelArg) : resolveApiModel(cliModelArg);

  const runOptions: RunOracleOptions = {
    prompt,
    model: resolvedModel,
    file: files ?? [],
    search: true,
    heartbeatIntervalMs: 30,
  };

  return { runOptions, resolvedEngine };
}

export function ensureBrowserAvailable(engine: EngineMode): string | null {
  if (engine !== 'browser') {
    return null;
  }
  if (process.env.CHROME_PATH) {
    return null;
  }
  const found = Launcher.getFirstInstallation();
  if (!found) {
    return 'Browser engine unavailable: no Chrome installation found and CHROME_PATH is unset.';
  }
  return null;
}
