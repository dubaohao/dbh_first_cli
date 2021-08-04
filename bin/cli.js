#!/usr/bin/env node
// ⬆️：指定easy.js的解释程序是node。
// ⬆️：第一行很重要，用来指明运行环境

// 声明program变量
const { Command } = require("commander");
const program = new Command();

program.version(require("../package.json").version);


program
  .command("create <app-name>")   //定义脚手架的命令是 create
  .description("create a vue app and config some dependencies")
  .action((name) => { //获取项目名，调用创建项目的函数
   const options = program.opts();  
    require("../lib/create")(name, options); 
  });

program.parse(process.argv);
