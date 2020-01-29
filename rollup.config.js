import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import stripBanner from 'rollup-plugin-strip-banner';

import pkgJson from './package.json';

const reactShallowRendererVersion = pkgJson.version;

const knownGlobals = {
  react: 'React',
};

const license = ` * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.`;

function wrapBundle(source, filename) {
  return `/** @license ReactShallowRenderer v${reactShallowRendererVersion}
 * ${filename}
 *
${license}
 */

${source}`;
}

function createConfig(bundleType) {
  const filename = 'react-shallow-renderer.js';
  const outputPath = `build/${bundleType}/${filename}`;

  const shouldBundleDependencies = bundleType === 'umd';
  const isUMDBundle = bundleType === 'umd';

  let externals = Object.keys(knownGlobals);
  if (!shouldBundleDependencies) {
    externals = [...externals, ...Object.keys(pkgJson.dependencies)];
  }

  return {
    input: 'src/ReactShallowRenderer.js',
    external(id) {
      const containsThisModule = pkg => id === pkg || id.startsWith(pkg + '/');
      const isProvidedByDependency = externals.some(containsThisModule);
      if (!shouldBundleDependencies && isProvidedByDependency) {
        return true;
      }
      return !!knownGlobals[id];
    },
    plugins: [
      resolve(),
      stripBanner({
        exclude: /node_modules/,
      }),
      babel({exclude: 'node_modules/**'}),
      isUMDBundle &&
        replace({
          'process.env.NODE_ENV': "'development'",
        }),
      commonjs({
        include: /node_modules/,
        namedExports: {'react-is': ['isForwardRef', 'isMemo', 'ForwardRef']},
      }),
      // License header.
      {
        renderChunk(source) {
          return wrapBundle(source, filename);
        },
      },
    ].filter(Boolean),
    output: {
      file: outputPath,
      format: bundleType,
      globals: knownGlobals,
      interop: false,
      name: 'ReactShallowRenderer',
    },
  };
}

export default [createConfig('cjs'), createConfig('esm'), createConfig('umd')];
