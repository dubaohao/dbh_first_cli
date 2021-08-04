module.exports = {
  publicPath: "./", //配置根路径
  outputDir: "dist", //构建输出目录
  assetsDir: "assets", //静态资源目录(js\css\img)
  lintOnSave: true, //是否开启eslint
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {},
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    //如果需要css热更新就设置为false,打包时候要改为true
    extract: false,
    // 开启 CSS source maps?
    sourceMap: process.env.NODE_ENV !== "production",
    // css预设器配置项
    // loaderOptions: {
    //   sass: {
    //     prependData: `@import "@/styles/variables.scss";`,
    //   },
    // },
  },

  chainWebpack: (config) => {
    config.resolve.symlinks(true);
    (config.entry.app = ["babel-polyfill", "./src/main.js"]),
      // 别名配置
      config.resolve.alias
        .set("@", resolve("src"))
        .set("@utils", resolve("src/utils"))
        .set("@api", resolve("src/api"))
        .set("@components", resolve("src/components"))
        .set("@pic", resolve("src/assets/imgs"));
    config.resolve.extensions.clear().merge([".js", ".vue", ".json"]);


    config.optimization.splitChunks({
      chunks: "all", // 控制webpack选择哪些代码块用于分割（其他类型代码块按默认方式打包）。有3个可选的值：initial、async和all。
      minSize: 30000, // 形成一个新代码块最小的体积
      maxSize: 0,
      minChunks: 2, // 在分割之前，这个代码块最小应该被引用的次数（默认配置的策略是不需要多次引用也可以被分割）
      maxAsyncRequests: 5, // 按需加载的代码块，最大数量应该小于或者等于5
      maxInitialRequests: 3, // 初始加载的代码块，最大数量应该小于或等于3
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial", // only package third parties that are initially dependent
        },
        commons: {
          name: "chunk-commons",
          test: resolve("src/components"), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    });

    config.plugins.delete("prefetch-index");
    config.plugins.delete("preload-index");
  },
};

