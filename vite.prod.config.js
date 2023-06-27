/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {defineConfig, } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {replaceCodePlugin} from 'vite-plugin-replace';
import babel from '@rollup/plugin-babel';
import {
  createStyleImportPlugin,
  AntdResolve,
} from 'vite-plugin-style-import'
import { visualizer } from "rollup-plugin-visualizer";
const moduleResolution = [
  {
    find: 'shared',
    replacement: path.resolve('./src/shared/src'),
  },
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    visualizer(),
    createStyleImportPlugin({
      resolves: [
        AntdResolve(),
      ],
      libs: [
        // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
        {
       
        },
      ],
    }),
    replaceCodePlugin({
      replacements: [
        {
          from: /__DEV__/g,
          to: 'false',
        },
      ],
    }),
    babel({
      babelHelpers: 'bundled',
      babelrc: false,
      configFile: false,
      exclude: '/**/node_modules/**',
      extensions: ['jsx', 'js', 'ts', 'tsx', 'mjs'],
      plugins: ['@babel/plugin-transform-flow-strip-types'],
      presets: ['@babel/preset-react'],
    }),
    react(),
  ],
  resolve: {
    alias: moduleResolution,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        split: new URL('./split/index.html', import.meta.url).pathname,
      },
    },
    commonjsOptions: {include: []},
    minify: 'terser',
    terserOptions: {
      compress: {
        toplevel: true,
      }
    },
  },
});
