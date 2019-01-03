const VueLoaderPlugin = require('vue-loader/lib/plugin'),
  webpack = require('webpack'),
  path = require('path');

module.exports = {
  entry: {
    bundle: ['babel-polyfill', './js/index'],
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader',
      },
      {
        test: /\.(ttf|eot|svg|jpg|png|jpeg|mp4)(\?[\s\S]+)?$/,
        loader: 'file-loader',
        options: {
          publicPath: 'public/'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {}
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Tether: 'tether',
      'window.Tether': 'tether'
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',

    },
  },
  stats: {
    warnings: false
  },
  node: {
    fs: "empty"
  }
};