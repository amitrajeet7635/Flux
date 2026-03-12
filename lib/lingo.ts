import { LingoDotDevEngine } from "@lingo.dev/_sdk";

const apiKey = process.env.LINGO_API_KEY;

if (!apiKey) {
  throw new Error("Missing environment variable: LINGO_API_KEY");
}

export const lingo = new LingoDotDevEngine({ apiKey });
