#!/usr/bin/env node

const spawn = require("child_process").spawn //spawn 使用给定的 command 和 args 中的命令行参数衍生新进程
const fs = require("fs")
const inquirer = require("inquirer");
const generate = require("./generate")

/**
 * @description: delete project
 */
function removeDir(filePath) {
 const stat = fs.statSync(filePath);
 if(stat.isFile()){
   fs.unlinkSync(filePath);
 }else{
  const files = fs.readdirSync(filePath);
  console.log(files)
  if (files.length === 0) {
    fs.rmdirSync(filePath);
  } else {
    let tempFiles = 0;
    files.forEach((file) => {
      tempFiles++;
      const nextFilePath = `${filePath}/${file}`;
      removeDir(nextFilePath);
    });
    //删除母文件夹下的所有子空文件夹后，将母文件夹也删除
    if (tempFiles === files.length) {
      fs.rmdirSync(filePath);
    }
  }
 }
}

const choices = [
  {
    name: "vue.config.js",
    checked:true
  },
  {
    name: "Axios",
  },
  {
    name: "Gzip",
  },
  {
    name: "Vconsole",
  }
];

const questions = [
  {
    type: "checkbox",
    name: "configs",
    message: "Select the config in your app",
    choices,
  },
  {
    type: "confirm",
    name: "UI_Components",
    message: "Do you want to install the ui component library?",
  },
  {
    type: "list",
    name: "ui",
    message: "Select the config in your app",
    choices: ["Element UI", "Ant Design", "Vant"],
    when(answers) {
      return answers.UI_Components;
    },
  },
];


async function create(projectName,options) {
 const cmd = spawn("vue", ["create", projectName],{ stdio:["inherit", "inherit", "pipe"]}) //使用vue create 命令创建初始化项目

 cmd.on("close", function(code, signal){
   if(code===0){//vue初始化项目创建成功，调用inquirer方法，询问用户
    console.log("vue初始化项目创建成功");
    inquirer.prompt(questions).then(async (answers) => {
      if(answers.configs.includes("vue.config.js")){
       await generate.generateVueConfigJS(projectName);//调用生成vue.config.js的方法
      }
      if (answers.configs.includes("Gzip")) {
        //调用 安装并配置compression-webpack-plugin 的方法
        await generate.installCompressionWebpackPlugin(projectName);
      }
    });
   }
 })
 process.on("SIGINT", function () {//监听进程主动关闭，删掉未创建完的项目
   console.log("Got SIGINT.  Press Control-D/Control-C to exit.");
   removeDir(projectName);
 });

}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    error(err);
    process.exit(1);
  });
};