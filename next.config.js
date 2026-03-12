// @ts-check
const { withLingo } = require('@lingo.dev/compiler/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = async function () {
  return await withLingo(nextConfig, {
    sourceRoot: './src',
    sourceLocale: 'en',
    targetLocales: ['de', 'ja', 'ar', 'fr', 'es', 'pt'],
    models: 'lingo.dev',
    buildMode: 'cache-only',
  });
};
