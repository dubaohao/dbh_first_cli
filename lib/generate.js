const fs = require("fs");
const ora = require("ora");
const spawn = require("child_process").spawn;

/**
 * @description: 生成vue.config.js文件
 */
function generateVueConfigJS(projectName) {
  return new Promise((resolve, reject) => {
    const spinner = ora({
      text: "Generating vue.config.js",
      color: "yellow",
    });
    let file = fs.createReadStream(`${__dirname}/vueConfig.js`, {
      encoding: "utf8",
    });

    let out = fs.createWriteStream(
      `${process.cwd()}/${projectName}/vue.config.js`,
      {
        encoding: "utf8",
      }
    );

    file.on("data", function (dataChunk) {
      out.write(dataChunk, function () {
        spinner.start();
      });
    });

    out.on("open", function (fd) {});

    file.on("end", function () {
      out.end("", function () {
        setTimeout(() => {
          spinner.succeed("Successfully generated vue.config.js");
        }, 500);
        resolve(true);
      });
    });
  });
}

//安装并配置compression-webpack-plugin
function installCompressionWebpackPlugin(projectName) {
 return new Promise((resolve, reject) => {
      const spinner = ora({
        text: "install compression-webpack-plugin",
        color: "yellow",
      }).start();
      const cmd = spawn(
        "npm",
        ["install", "compression-webpack-plugin@4.0.0"],
        {
          stdio: "pipe",
          cwd: `${process.cwd()}/${projectName}`,
        }
      );
      cmd.on("close", function (code, signal) {
        if (code === 0) {
          const content = `const path = require("path")
   const CompressionWebpackPlugin = require("compression-webpack-plugin")
   const isProd = process.env.NODE_ENV === "production"
   function resolve(dir) {
     return path.join(__dirname, dir)
   }
    `;
          const content2 = `
     configureWebpack: (config) => {
       if (isProd) {
         // 生产环境
         config.plugins.push(
           new CompressionWebpackPlugin({
             // 正在匹配需要压缩的文件后缀
             test: /\.(js|css|svg|woff|ttf|json|html)$/,
             // 大于10kb的会压缩
             threshold: 10240,
             deleteOriginalAssets: false
             // 其余配置查看compression-webpack-plugin
           })
         )
       }
     },`;
          //往固定的行写入数据
          const data = fs
            .readFileSync(`${process.cwd()}/${projectName}/vue.config.js`, "utf8")
            .split("\n");
          data.splice(0, 0, content);
          fs.writeFileSync(
            `${process.cwd()}/${projectName}/vue.config.js`,
            data.join("\n"),
            "utf8"
          );
          const data2 = fs
            .readFileSync(`${process.cwd()}/${projectName}/vue.config.js`, "utf8")
            .split("\n");
          data2.splice(data2.length - 45, 0, content2);
          fs.writeFileSync(
            `${process.cwd()}/${projectName}/vue.config.js`,
            data2.join("\n"),
            "utf8"
          );
          spinner.succeed("install compression-webpack-plugin success");
          resolve();
        } else {
          spinner.warn("install compression-webpack-plugin error");
          reject(`install compression-webpack-plugin error`);
        }
      });
 });


}

module.exports = {
  generateVueConfigJS,
  installCompressionWebpackPlugin,
};

