const bundle = require("less-bundle-promise");
const path = require("path");
const fs = require("fs");

class WebpackBundleLessPlugin {
  constructor(options) {
    if (!options.source || !fs.existsSync(options.source)) {
      console.error(
        "WebpackBundleLessPlugin please set source in options, source must be a less file absolute path"
      );
    }
    const defaultOpt = {
      indexFileName: "./index.html",
      source: "",
      lessUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js"
    };

    this.options = Object.assign({}, defaultOpt, options);
  }

  getPublicPath(compilation) {
    const webpackPublicPath = compilation.mainTemplate.getPublicPath({
      hash: compilation.hash
    });
    const isPublicPathDefined = webpackPublicPath.trim() !== "";

    return isPublicPathDefined ? webpackPublicPath : "";
  }

  apply(compiler) {
    const { options } = this;
    compiler.hooks.emit.tapAsync(
      "WebpackBundleLessPlugin",
      (compilation, callback) => {
        const publicPath = this.getPublicPath(compilation);
        console.info(publicPath, compilation.hash);
        const html = `
                <link rel="stylesheet/less" type="text/css" href="${publicPath}bundle.less" />
                <script>
                window.less = {
                    async: false,
                    env: 'development',
                    javascriptEnabled: true
                };
                </script>
                <script type="text/javascript" src="${
                  options.lessUrl
                }"></script>
            `;
        if (
          options.indexFileName &&
          options.indexFileName in compilation.assets
        ) {
          const index = compilation.assets[options.indexFileName];
          let content = index.source();

          if (!content.match(/\/bundle\.less/g)) {
            index.source = () =>
              content.replace(html, "").replace(/<body>/gi, `<body>${html}`);
            content = index.source();
            index.size = () => content.length;
          }
        }
        if (this.lessData) {
          compilation.assets["bundle.less"] = {
            source: () => this.lessData,
            size: () => this.lessData.length
          };
          return callback();
        }
        bundle({
          src: options.source
        })
          .then(output => {
            this.lessData = output;
            compilation.assets["bundle.less"] = {
              source: () => this.lessData,
              size: () => this.lessData.length
            };
            return callback();
          })
          .catch(err => {
            callback(err);
          });
      }
    );
  }
}

module.exports = WebpackBundleLessPlugin;
