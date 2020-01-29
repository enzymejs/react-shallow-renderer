module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    process.env.NODE_ENV === 'test' &&
      '@babel/plugin-transform-react-jsx-source',
  ].filter(Boolean),
};
