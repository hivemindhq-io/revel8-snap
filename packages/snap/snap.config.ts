import type { SnapConfig } from '@metamask/snaps-cli';
import { resolve } from 'path';

const config: SnapConfig = {
  bundler: 'webpack',
  input: resolve(__dirname, 'src/index.tsx'),
  server: {
    port: 8080,
  },
  polyfills: {
    buffer: true,
  },
  customizeWebpackConfig: (webpackConfig) => {
    // Add webpack aliases to match TypeScript paths
    webpackConfig.resolve = webpackConfig.resolve ?? {};
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '~': resolve(__dirname, '../../common'),
      '@': resolve(__dirname, '../..'),
    };
    return webpackConfig;
  },
};

export default config;
