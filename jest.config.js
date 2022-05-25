module.exports = {
  setupFiles: ['./test/env-setup.js'],
  setupFilesAfterEnv: ['./test/test-setup.js'],
  // node_modules is default.
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  clearMocks: true,
  transform: {
    '^.+\\.html?$': './test/posthtml-jest.js',
    '^.+\\.svg?$': './test/posthtml-jest.js',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // hide any of these data files from the coverage reports
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
  },
}
