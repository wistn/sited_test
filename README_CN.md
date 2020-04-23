# sited_test

SiteD 引擎 js 版、SiteD 插件测试工具，用于多多猫插件者在电脑桌面平台测试自己的插件。

[ [Readme-EN](README.md)]

---

## 特性

-   自动测试 SiteD 插件
-   支持 `schema0/1/2`
-   支持运行 `buildUrl` `parseUrl`(`CALL::`) `parse`(`get`/`post`/`@null`) `require`(含网络 js 库)
-   支持 `header`(`cookie`/`referer`) `ua` 配置
-   支持 `hots` `updates` `tags` `tag`(`subtag`) `search` `book[12345678]`(`sections`) `section[123]` 节点

---

## API接口

```js
/**
* 在Nodejs环境输出节点数据到控制台
* @param sitedPath: .sited或.sited.xml文件路径，建议填绝对路径
* @param key: 用于在搜索节点上搜索的关键词字符串
* @param callback: 输出home/search/book节点的入口测试函数
* @param nodeName@doTest@home_test: 字符串'hots', 'updates' 或者 'tags'，用于开始hots/updates/tags节点的测试函数
* @param bookUrl@book_test: book节点函数的url参数，用于book节点单独测试
*/
sited_test(
    sitedPath: string,
    key: string,
    callback: (
        home_test?: (
            cback: (doTest: (nodeName: 'hots' | 'updates' | 'tags', cb: () => void) => void) => void
        ) => void,
        search_test?: (cb: () => void) => void,
        book_test?: (bookUrl: string, from_where: 'from_外部传值', cb: () => void) => void
    ) => void
): void;
```

---

### [[特性](#特性)|[API接口](#API接口)|[使用](#使用)|[配置](#配置)|[依赖](#依赖)|[待办](#待办)|[更新日志](#更新日志)|[致谢](#致谢)|[友链](#友链)]

---

## 使用

> #### 1.如下在 npm 本地安装项目之后 `npm i sited_test --production`

A. 在 sited_test 文件夹通过 Node 运行像 demo.js 般调用 API 接口的 js 脚本：

```js
// demo.js文件，已经写了 .sited 或 .sited.xml 文件路径
var sited_test = require('./index.js');
var async = require('async');
var path = require('path');
var sitedPath = path.join(__dirname, 'demo.sited.xml');
var key = '我们';
sited_test(sitedPath, key, (home_test, search_test, book_test) => {
    // let bookUrl = 'http:// book节点函数的url参数';
    async.series(
        [
            // async.apply(book_test, bookUrl, 'from_OuterValue'),
            (asyncCallback) => {
                home_test((doTest) => {
                    async.series(
                        [
                            async.apply(doTest, 'hots'),
                            async.apply(doTest, 'updates'),
                            async.apply(doTest, 'tags')
                        ],
                        () => asyncCallback()
                    );
                });
            },
            async.apply(search_test)
        ],
        () => console.log('结束测试本插件')
    );
});
```

```bash
cd /path/to/node_modules/sited_test
node demo.js
```

或者 B.

```bash
# 不需要 cd
node /path/to/node_modules/sited_test/bin.js <sitedPath> [<key>]

# sitedPath: .sited 或 .sited.xml 的文件路径
# key(可选): 用于在搜索节点上搜索的关键词字符串，如果没输入，会使用 bin.js 内置的关键词
```

或者 C. 其实，在 VS Code 上编辑 sited 插件文件时用 [Code Runner 插件](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)或者内置的调试器来调用 Node 是很快的。

a. 配置 Code Runner 对.sited 和 .sited.xml 文件通过以下 node 命令运行，就可以在编辑器当前焦点所处 sited 插件文件时启动 Code Runner，直接测试插件，不需要填写插件路径，会通过 \$fullFileName 识别。

```json
"code-runner.executorMapByGlob": {
    "*.{sited,sited.xml}": "node --unhandled-rejections=strict /path/to/node_modules/sited_test/bin.js $fullFileName key"
}
// 把 /path/to/node_modules/sited_test/bin.js 替换为bin.js实际路径。如果删除(key)，会使用 bin.js 内置的关键词
```

或者 b. 增加新的调试配置通过以下 node 命令运行，就可以在编辑器当前焦点所处 sited 插件文件时启动调试(sited_test)，直接测试插件，不需要填写插件路径，会通过 \${file} 识别。

```json
"launch": {
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "sited_test",
            "program": "/path/to/node_modules/sited_test/bin.js",
            "runtimeArgs": [
                "--unhandled-rejections=strict"
            ],
            "args": [
                "${file}",
                "关键词"
            ]
        }
    ]
}
```

把 /path/to/node_modules/sited_test/bin.js 替换为 bin.js 实际路径。如果删除 `,"关键词"` ，会使用 bin.js 内置的关键词

> #### 或者 2. 如下在 npm 全局安装项目之后 `npm i sited_test -g`
>
> 在命令行界面单独输入 `sited_test` 会看到:

```bash
Tests own SiteD plugin on Nodejs

sitedPath: File path of .sited or .sited.xml.
key(optional): A keyword string that is used for searching on search node, if not be inputted, built-in keyword of bin.js would be used.

Usage: sited_test <sitedPath> [key]
Usage: sited_test [options]

Options:
  --version  Show version number
  --help     Show help
  --demo     Tests a demo sited plugin
Examples:
  sited_test /path/to/sited.sited.xml  #Outputs nodes' data to console on Nodejs.
```

---

## 配置

-   `npm run test`: 在命令行界面项目文件夹下，运行该代码，可以测试样本 sited 插件并显示结果在控制台
-   `npm run clean`: 在命令行界面项目文件夹下，运行该代码，可以删除运行项目后生成的日志文件和缓存文件夹，前提要已通过 `npm i rimraf -g` 安装 rimraf 命令
-   控制项目文件夹下 sited_log.txt/sited_error.txt/sited_print.txt 和 sited(缓存文件夹) 生成的配置，见 index.js 文件.

---

## 依赖

-   [nodejs](https://nodejs.org/en/)

---

## 待办:

-   支持 login 节点，从 book[8] 跳转到 section 节点.

---

## 更新日志

v1 发布

---

## 致谢

### 里面 lib 库是完全将 Noear 开源的 [SiteD 引擎](https://github.com/noear/SiteD) v35 容器大部分 JAVA 代码翻译成的 Nodejs 语言。感谢！

---

## 友链

-   [ddcat_plugin_develop](https://www.kancloud.cn/magicdmer/ddcat_plugin_develop) 多多猫插件开发指南，关于多多猫插件开发相关知识

-   [DDCat SiteD](https://github.com/Yinr/DDCa-SiteD.vscode-ext) VS Code 扩展插件，对 .sited 和 .sited.xml 文件识别为 SiteD 语言，提供语法高亮

-   [generators-sited-plugin](https://github.com/htynkn/generators-sited-plugin) Yeoman 生成器快速初始化项目
