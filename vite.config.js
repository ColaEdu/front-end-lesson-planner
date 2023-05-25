/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import path from 'path';
import fs from 'fs';
import { replaceCodePlugin } from 'vite-plugin-replace';
import babel from '@rollup/plugin-babel';
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  NutuiResolve,
  AntdResolve,
} from 'vite-plugin-style-import'
// import autoImportLess from './vite-plugin-auto-import.less';
import resolvePlugin from 'vite-plugin-resolve';

const moduleResolution = [
  {
    find: 'shared',
    replacement: path.resolve('./src/shared/src'),
  },
  {
    find: '~antd',
    replacement: 'antd'
  }
];


// https://vitejs.dev/config/
export default defineConfig({
  // define: {
  //  'ENV': 'dev',
  // },
  plugins: [
  
    createStyleImportPlugin({
      resolves: [
        // AndDesignVueResolve(),
        // VantResolve(),
        // ElementPlusResolve(),
        // NutuiResolve(),
        AntdResolve(),
      ],
      libs: [
        // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
        {
          // libraryName: '~antd',
          // esModule: true,
          // resolveStyle: (name) => {
          //   return `antd/es/${name}/style/index`
          // },
        },
      ],
    }),
    replaceCodePlugin({
      replacements: [
        {
          from: /__DEV__/g,
          to: 'true',
        },
      ],
    }),
    babel({
      babelHelpers: 'bundled',
      babelrc: false,
      configFile: false,
      exclude: '/**/node_modules/**',
      extensions: ['jsx', 'js', 'ts', 'tsx', 'mjs'],
      plugins: [
        '@babel/plugin-transform-flow-strip-types',
        // [
        //   require('../../scripts/error-codes/transform-error-messages'),
        //   {
        //     noMinify: true,
        //   },
        // ],
      ],
      presets: ['@babel/preset-react'],
    }),
    react(),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@colorPrimary': '#212b36',
        },
      },
    },
  },

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
  },
});
