const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const publicPath = process.env.PUBLIC_PATH || '/';
const publicUrl = publicPath.slice(0, -1);

const config = {
  bail: true,
  devtool: 'cheap-module-source-map',
  entry: {
    index: path.resolve(__dirname, 'src/index')
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath
  },
  devServer: {
    port: 8080,
    contentBase: false,
    compress: true,
    quiet: false,
    inline: true,
    lazy: false,
    hot: true,
    host: "0.0.0.0"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'less-loader',
              options: {
                paths: [
                  path.resolve(__dirname, 'node_modules')
                ]
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    flexbox: 'no-2009'
                  }),
                ],
              },
            }
          ],
          publicPath
        })
      },
      {
        test: /\.(ico|png|svg|woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'process.env.PUBLIC_PATH': JSON.stringify(publicPath)
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.ejs'
    }),
    new CopyWebpackPlugin([
        {from: 'public/favicons'},
        {from: 'public'}
      ]
    ),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new ManifestPlugin({
        fileName: 'asset-manifest.json'
    })
  ]
};

module.exports = config;
