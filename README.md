# vite-plugin-require-transform

[![NPM](https://nodei.co/npm/vite-plugin-require-transform.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vite-plugin-require-transform/)

[![npm version](https://img.shields.io/npm/v/vite-plugin-require-transform.svg)](https://www.npmjs.com/package/vite-plugin-require-transform)

A Vite plugin that converts code from `require` syntax to `import`

## Why you need this plugin

**`require` syntax** is supported when developing with **Webpack** because it internally transforms `require`.

However, with **Vite** the error **"require is not defined"** will show up.

This plugin fixes that.


## Install

```bash
npm i vite-plugin-require-transform --save-dev
```


## Usage

```typescript
// vite.config.(t|j)s

import { defineConfig } from 'vite';

import requireTransform from 'vite-plugin-require-transform';

export default defineConfig({
  plugins: [
    requireTransform({}),
  ],
});
```

*(For additional options check `VitePluginRequireTransformParamsType` in "src/index.ts")*


## What this plugin does

Check results in the "\_\_test\_\_" directory for an overview of the transformations.