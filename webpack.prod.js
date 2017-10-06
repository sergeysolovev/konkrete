const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const publicPath = process.env.PUBLIC_PATH || '/';
const publicUrl = publicPath.slice(0, -1);
const publicDir = 'dist';
const outputDir = path.resolve(__dirname, publicDir);

const config = {
  bail: true,
  devtool: 'source-map',
  entry: {
    index: path.resolve(__dirname, 'src/index')
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    path: outputDir,
    publicPath
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
                  path.resolve(__dirname, 'node_modules'),
                  path.resolve(__dirname, 'app')
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
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9',
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            }
          ],
          publicPath
        })
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      },
      {
        test: /\.(ico|woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([
      outputDir
    ]),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'process.env.PUBLIC_PATH': JSON.stringify(publicPath)
      }
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),
    new CopyWebpackPlugin([
        {from: 'public/favicons'},
        {from: 'public'}
      ],
      {
        ignore: 'public/index.html'
      }
    ),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      allChunks: true
    }),
    new ManifestPlugin({
        fileName: 'asset-manifest.json'
    })
  ]
};

module.exports = config;
