# webpack-bundle-less-plugin

Bundle less file and output to html file

# Getting Started

```shell
npm install webpack-bundle-less-plugin
```

webpack.config.js

```js
const WebpackBundleLessPlugin = require("webpack-bundle-less-plugin");
moduel.exports = {
  plugin: [
    new WebpackBundleLessPlugin({
      source: path.resolve(process.cwd(), "/node_modules/antd/dist/antd.less")
    })
  ]
};
```

# options

1. `source`: the less file absolute path
2. `indexFileName`: HtmlWebpackPlugin.fileName
3. `lessUrl`: less.js cdn url
