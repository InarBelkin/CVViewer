const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = (env) =>
  merge(common(env), {
    mode: 'production',
    devtool: false,
    output: {
      path: paths.build,
      filename: 'js/[name].[contenthash].bundle.js',
      publicPath: process.env.WEBPACK_PUBLIC_PATH ?? '/',
      clean: true,
    },
    plugins: [
      // Extracts CSS into separate files
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css',
        chunkFilename: '[id].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(sass|scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: false,
                modules: true,
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new CssMinimizerPlugin(), '...'],
      runtimeChunk: {
        name: 'runtime',
      },
    },
  });
