import { LingoDotDevEngine } from '@lingo.dev/_sdk';

// Lazy singleton — initialized on first call to avoid build-time validation errors
let _engine: LingoDotDevEngine | null = null;

export function getLingo(): LingoDotDevEngine {
  if (!_engine) {
    _engine = new LingoDotDevEngine({ apiKey: process.env.LINGO_API_KEY ?? '' });
  }
  return _engine;
}

// Convenience shorthand used by API routes
export const lingo = {
  localizeText: (...args: Parameters<LingoDotDevEngine['localizeText']>) =>
    getLingo().localizeText(...args),
  localizeObject: (...args: Parameters<LingoDotDevEngine['localizeObject']>) =>
    getLingo().localizeObject(...args),
};
