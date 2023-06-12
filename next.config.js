const path = require("path");
const process = require("process");
const CopyPlugin = require("copy-webpack-plugin");
const pathBuilder = (subpath) => path.join(process.cwd(), subpath);

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.resolve.alias["@/data"] = pathBuilder("data");
    config.resolve.alias["@/utils"] = pathBuilder("utils");
    config.resolve.alias["@/styles"] = pathBuilder("styles");
    config.resolve.alias["@/store"] = pathBuilder("store");
    config.resolve.alias["@/components"] = pathBuilder("components");
    config.resolve.alias["@/cesiumSource"] = pathBuilder("node_modules/cesium/Source");
    config.output["sourcePrefix"] = "";

    // Copy assets needed by Cesium to public folder so that they can be easily accessed.
    // * "to" path is relative to the path in "from"
    config.plugins.push(
      new CopyPlugin({patterns: [{ from: pathBuilder("node_modules/cesium/Build/Cesium/Workers"), to: "../public/Workers" }]}),
      new CopyPlugin({patterns: [{ from: pathBuilder("node_modules/cesium/Source/Assets"), to: "../public/Assets" }]}),
      new CopyPlugin({patterns: [{ from: pathBuilder("node_modules/cesium/Source/Widgets"), to: "../public/Widgets" }]}),
      new webpack.DefinePlugin({CESIUM_BASE_URL: JSON.stringify("/")})
    );
    
    return config;
  }
};

module.exports = nextConfig;
