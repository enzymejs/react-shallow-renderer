module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: process.env.NODE_ENV === 'test' ? 'auto' : false,
        // Exclude transforms that make all code slower.
        exclude: ['transform-typeof-symbol'],
        targets: process.env.NODE_ENV === 'test' ? {node: 'current'} : {ie: 11},
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    ['@babel/plugin-transform-classes', {loose: true}],
    ['@babel/plugin-transform-template-literals', {loose: true}],
    // The following plugin is configured to use `Object.assign` directly.
    // Note that we ponyfill `Object.assign` below.
    // { ...todo, complete: true }
    [
      '@babel/plugin-proposal-object-rest-spread',
      {loose: true, useBuiltIns: true},
    ],
    // Use 'object-assign' ponyfill.
    require.resolve('./scripts/babel/transform-object-assign-require'),
    // Keep stacks detailed in tests.
    process.env.NODE_ENV === 'test' &&
      '@babel/plugin-transform-react-jsx-source',
  ].filter(Boolean),
};
