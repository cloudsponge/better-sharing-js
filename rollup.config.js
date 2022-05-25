import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import re from 'rollup-plugin-re'
import strip from '@rollup/plugin-strip'
import { uglify } from 'rollup-plugin-uglify'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import posthtml from 'rollup-plugin-posthtml-template'
import htmlMinifier from 'rollup-plugin-html-minifier'
import minifier from 'posthtml-minifier'
import url from '@rollup/plugin-url'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import postcssUrl from 'postcss-url'

const babelOptions = require('./babel.config')

const baseBuild = {
  input: './src/index.js',
  output: {
    format: 'iife',
    globals: { window: 'window' },
  },
  plugins: [
    json(),
    htmlMinifier({
      // html-minifier options here
      collapseWhitespace: true,
    }),
    posthtml({
      // include: '**/*.html',
      template: true,
      plugins: minifier({
        removeComments: true,
        collapseWhitespace: true,
        // we're unable to use the minifyCSS option while we're replacing strings in it
        minifyCSS: false,
      }),
    }),
    postcss({
      inject: false,
      // extract: true,
      minimize: true,
      plugins: [
        postcssUrl({
          url: 'inline', // enable inline assets using base64 encoding
          maxSize: 10, // maximum file size to inline (in kilobytes)
          fallback: 'copy', // fallback method to use if max size is exceeded
        }),
      ],
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: ['.js', '.html', '.scss'],
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

  const { holder, archetypes } = require(`./src/lib/platforms/${target}.json`)

  const replacementRes = [
    {
      test: /\$\{_\.holder\.selector\}/g,
      replace: holder.selector || '',
    },
    {
      test: /(?<!\.)holder\.selector/g,
      replace: JSON.stringify(holder.selector),
    },
    {
      test: /(?<!\.)holder\.ancestorSelector/g,
      replace: JSON.stringify(holder.ancestorSelector),
    },
    {
      test: /(?<!_\.)holder\.classes/g,
      replace: JSON.stringify(holder.classes),
    },
  ]

  Object.keys(archetypes).forEach((archType) => {
    replacementRes.push({
      test: new RegExp(`\\$\\{_\\.archetypes\\.${archType}\\.selector}`),
      replace: archetypes[archType].selector || '',
    })

    // replacementRes.push({
    //   test: new RegExp(`\\$\\{_\\.archetypes\\.${archType}\\.styles}`),
    //   replace: archetypes[archType].styles || '',
    // })
  })

  const newOptions = { ...base }
  newOptions.output = {
    ...base.output,
    name: 'betterSharing',
    file: `packages/${target}/${targetName}.js`,
  }
  newOptions.plugins = [
    re({
      patterns: replacementRes,
    }),
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

const customBuild = (
  opts = { prod: false, input: './index.js', output: {} }
) => {
  const base = opts.prod ? minifiedOptions(baseBuild) : baseBuild
  const newOptions = { ...base }

  // specify the input
  newOptions.input = opts.input
  // specify the output
  newOptions.output = {
    ...base.output,
    ...opts.output,
  }

  if (opts.plugins) {
    newOptions.plugins = [...base.plugins, ...opts.plugins]
  }
  if (opts.pluginsPre) {
    newOptions.plugins = [...opts.pluginsPre, ...newOptions.plugins]
  }
  if (opts.babelOpts) {
    newOptions
  }

  return newOptions
}

const shopifyConjuredReferralBuildOpts = (prod = false) => {
  const outputFile = prod
    ? './packages/shopify/conjured-referrals/better-sharing-shopify-conjured-referrals.js'
    : './packages/shopify/conjured-referrals/better-sharing-shopify-conjured-referrals.debug.js'
  return {
    prod,
    input: './src/platforms/shopify/conjured-referrals/betterSharing.js',
    output: {
      name: 'betterSharing',
      file: outputFile,
      format: 'iife',
      globals: { window: 'window' },
    },
    pluginsPre: [url()],
  }
}

const genericBuildOpts = (prod = false) => {
  const outputFile = prod
    ? './packages/generic/better-sharing.js'
    : './packages/generic/better-sharing.debug.js'
  return {
    prod,
    input: './src/platforms/generic/betterSharing.js',
    output: {
      name: 'betterSharing',
      file: outputFile,
      format: 'iife',
      globals: { window: 'window' },
    },
    pluginsPre: [url()],
  }
}

export default [
  targetBuild('kickoff-labs'),
  targetBuild('kickoff-labs', { prod: true }),

  customBuild(shopifyConjuredReferralBuildOpts()),
  customBuild(shopifyConjuredReferralBuildOpts(true)),

  // Generic build for generic/better-sharing.js
  customBuild(genericBuildOpts()),
  customBuild(genericBuildOpts(true)),
]
