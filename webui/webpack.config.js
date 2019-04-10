const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production'
const ROOT_DIR = path.resolve(__dirname, './');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const STYLE_DIR = path.resolve(ROOT_DIR, 'src/styles');

module.exports = [
  {
    entry: [
      './src/index.html'
    ],
    output: {
      filename: 'main.js',
      path: DIST_DIR
    },
    mode: devMode ? 'development' : 'production',
    //devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            pretty: true
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.less$/,
          include: STYLE_DIR,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            //{
            //    loader: 'postcss-loader',
            //    options: {
            //      plugins: () => [autoprefixer()]
            //    }
            //},
            'css-loader',
            'less-loader'
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin({
        //dry: true
      }),
      //new webpack.optimize.OccurrenceOrderPlugin(),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        sourceMap: true,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './src/assets/favicon.png',
        inject: true,
        sourceMap: true,
        chunksSortMode: 'dependency'
      })
    ]
  }
];
