const CracoLessPlugin = require("craco-less");
const webpack = require("webpack");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
          // strictMath: true,
          // noIeCompat: true,
          // relativeUrls: false,
        },
        modifyLessRule: (lessRule, context) => {
          lessRule.use = lessRule.use.filter(
            (i) => !i.loader.includes("resolve-url-loader")
          );
          return lessRule;
        },
      },
    },
  ],
  webpack: {
    configure: {
      stats: {
        errorDetails: true,
      },
      module: {
        rules: [
          {
            test: [/\.js?$/, /\.ts?$/, /\.jsx?$/, /\.tsx?$/],
            enforce: "pre",
            exclude: /node_modules/,
            use: ["source-map-loader"],
          },
        ],
      },
    },

    plugins: [
      // fix "process is not defined" error:
      // (do "npm install process" before running the build)
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  },
};
