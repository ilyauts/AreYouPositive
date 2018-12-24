const ExtractTextPlugin = require('extract-text-webpack-plugin'),
  webpack = require('webpack'),
  path = require('path'),
  autoprefixer = require('autoprefixer'),
  bootstrapEntryPoints = require('./webpack.bootstrap.config.js'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    Home: ['babel-polyfill', bootstrapEntryPoints.prod, './js/app/Home'],
    Swagger: ['babel-polyfill', bootstrapEntryPoints.prod, './js/app/Swagger'],
    Main: ['babel-polyfill','tether', bootstrapEntryPoints.prod, './js/app/Main']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
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
          publicPath: 'dist/'
        }
      },
      {
        test: /bootstrap\/dist\/js\/umd\//,
        use: 'imports-loader?jQuery=jquery',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
        }
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether',
      'window.Tether': 'tether',
      Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      Clipboard: 'clipboard',
      Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      Cookies: 'js-cookie',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      Popper: ['popper.js', 'default'],
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
      Validator: 'bootstrap-validator'
    }),
    new webpack.LoaderOptionsPlugin({
      postcss: [autoprefixer],
    })
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.min.js',
    },
  },
  stats: {
    warnings: false
  },
  node: {
    fs: "empty"
 }
};

if(process.env.WEBSITE_HOSTNAME && process.env.WEBSITE_HOSTNAME.match('roarfrontend-prod')){
  module.exports.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      mangle: { toplevel: true },
      compress: {
        toplevel: true
      },
      output: {
        beautify: false
      }
    }
  }));
}

// Do not bundle analyze when not local (= in concourse or on Azure) or if I say so (docker build)
if(!(process.env.NO_WBA || process.env.IN_CONCOURSE || process.env.WEBSITE_HOSTNAME || process.env.NODE_ENV == 'production')){
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  module.exports.plugins.push(new BundleAnalyzerPlugin());
}
