const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = {
  webpack: override(
    addWebpackModuleRule({
      test: require.resolve('snapsvg'),
      loader: 'imports-loader?this=>window,fix=>module.exports=0',
    }),
    addWebpackModuleRule({
      test: /\.peg$/,
      use: 'canopy-loader',
    }),
  ),
};
