import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import re from 'rollup-plugin-re'
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
    // replace any instance of our TARGET_PLATFORM within a string
    re({
      patterns: [
        {
          test: /\$\{process.env.TARGET_PLATFORM\}/g,
          replace: target,
        },
      ],
    }),
    // now replace any dynamic require calls with their ES counterparts
    re({
      patterns: [
        {
          test: /const ([\S]+) = require\((['"`])([^\)]+)\2\)/g,
          replace: "import $1 from '$3'",
        },
      ],
    }),
    ...base.plugins,
  ]

  return newOptions
}

export default [
  targetBuild('kickoff-labs'),
  targetBuild('kickoff-labs', { prod: true }),
]
