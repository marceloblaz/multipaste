const path = require("path");

module.exports = (env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",
  entry: "./src/index.ts",
  devtool: argv.mode === "production" ? false : "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ["", ".ts"],
    mainFiles: ["index"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  output: {
    filename: "multipaste.bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
});
