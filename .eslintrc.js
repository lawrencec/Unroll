module.exports = {
  rules: {
    indent: [
      2,
      2
    ],
    quotes: [
      2,
      'single'
    ],
    semi: [
      2,
      'always'
    ]
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'standard'
  ],
  globals: {
    window: true,
    describe: true,
    it: true,
    beforeEach: true,
    afterEach: true,
    test: true,
    suite: true,
    jasmine: true
  }
};
