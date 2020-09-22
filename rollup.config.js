import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import strip from '@rollup/plugin-strip'
import { uglify } from 'rollup-plugin-uglify'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'

const babelOptions = require('./babel.config')

const baseBuild = {
  input: './src/index.js',
  output: {
    format: 'iife',
    globals: { window: 'window' },
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      ...babelOptions,
    }),
    resolve({
      extensions: ['.js'],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    sizeSnapshot({}),
  ],
}

const minifiedOptions = (base) => {
  const newOptions = { ...base }
  newOptions.plugins = [...base.plugins, strip({ debugger: true }), uglify()]
  return newOptions
}

const targetBuild = (target, opts = { prod: false }) => {
  const base = opts.prod ? minifiedOptions(baseBuild) : baseBuild
  const targetName = opts.prod
    ? `better-sharing-${target}-min`
    : `better-sharing-${target}-debug`

  const newOptions = { ...base }
  newOptions.output = {
    ...base.output,
    name: 'betterSharing',
    file: `packages/${target}/${targetName}.js`,
  }
  newOptions.plugins = [
    replace({
      '${process.env.TARGET_PLATFORM}': target,
    }),
    ...base.plugins,
  ]

  return newOptions
}

export default [
  targetBuild('kickoff-labs'),
  targetBuild('kickoff-labs', { prod: true }),
]
