import LingoDotDevSDK from '@lingo.dev/sdk';

// Singleton SDK instance for server-side use in API routes
export const lingo = new LingoDotDevSDK({ apiKey: process.env.LINGO_API_KEY! });
