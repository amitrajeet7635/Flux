const { lingoDotDevCompiler } = require('@lingo.dev/compiler');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = lingoDotDevCompiler(nextConfig, {
  sourceLocale: 'en',
  targetLocales: ['de', 'ja', 'ar', 'fr', 'es', 'pt'],
});
