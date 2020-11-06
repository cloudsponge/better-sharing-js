// posthtml-jest.js
'use strict'

// using 'rollup-plugin-posthtml-template' as a basis for processing the html in the same manner
const posthtml = require('posthtml')

// taken from the rollup-plugin for posthtml templating, which is used by this project
// https://github.com/posthtml/rollup-plugin-posthtml-template/blob/master/src/index.js
module.exports = {
  process(src, filename) {
    const result = posthtml().process(src, { sync: true })
    return `module.exports = (_) => \`${result.html}\``
  },
}
