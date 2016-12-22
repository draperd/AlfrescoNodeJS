'use strict';

var path = require('path');

const webpack = require('webpack');

module.exports = {
   context: __dirname + '/src',
   entry: {
     app: './app.js'
   },
   devtool: 'source-map',
   output: {
      path: __dirname + '/dist',
      filename: '[name].bundle.js',
      publicPath: '/assets'
   },
   devServer: {
      contentBase: __dirname + '/src',
      port: 9000
   },
   module: {
      rules: [
         // vue-loader webpack config taken from: https://github.com/vuejs-templates/webpack-simple
         {
           test: /\.vue$/,
           loader: 'vue-loader',
           options: {
             loaders: {
               // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
               // the "scss" and "sass" values for the lang attribute to the right configs here.
               // other preprocessors should work out of the box, no loader config like this nessessary.
               'scss': 'vue-style-loader!css-loader!sass-loader',
               'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
             }
             // other vue-loader options go here
           }
         },
         {
            test: /\.js$/,
            use: [{
               loader: 'babel-loader',
               options: { presets: ['es2015'] }
            }]
         },
         {
           test: /\.(png|jpg|gif|svg)$/,
           loader: 'file-loader',
           options: {
             name: '[name].[ext]?[hash]'
           }
         }
      ]
   },
   resolve: {
      alias: {
         'vue$': 'vue/dist/vue.common.js',
         'src': path.resolve(__dirname, '../src')
      }
   }
};