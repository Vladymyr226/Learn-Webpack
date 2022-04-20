const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === "development";
isProd = !isDev;
console.log("Is dev: ", isDev);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  };

  if (isProd) {
    config.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin()
    ];
  }

  return config;
};

const fileName = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    "css-loader"
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const babelOptions = preset => {
  const opts = {
    presets: ['@babel/preset-env']
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const jsLoaders = () => {
  const loaders = [{
    loader: "babel-loader",
    options: babelOptions()
  }];

  if (isDev) {
    loaders.push({
      loader: "eslint-loader",
      options: {
        eslintPath: "eslint"
      }
    });
  }

  return loaders;
};

const plugins = () => {
  const basePlugins = [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd
      },
      inject: "body"
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/favicon.ico"),
          to: path.resolve(__dirname, "dist")
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: fileName("css"),
    })
  ];

  if (isProd) {
    basePlugins.push(new BundleAnalyzerPlugin());
  }

  return basePlugins;
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./index.jsx"],
    analytics: "./analytics.ts"
  },
  output: {
    filename: fileName("js"),
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".js", ".json", ".png"],
    alias: {
      "@models": path.resolve(__dirname, "src/models"),
      "@": path.resolve(__dirname, "src"),
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4201,
    liveReload: false,
    // hot: isDev
  },
  devtool: isDev ? 'source-map' : false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.(sass|scss)$/,
        use: cssLoaders("sass-loader")
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader")
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource"
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: "asset/resource"
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript")
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react")
        }
      }
    ]
  }
};