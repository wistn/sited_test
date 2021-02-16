# sited_test

SiteD Engine for Node JavaScript version, SiteD plugin testing tool, for SiteD developers testing their own plugins on computer/desktop platform.

[ [中文说明](README_CN.md)]

---

## Features

-   To automatically test SiteD plugin on Windows/Linux/macOS
-   Support `schema0/1/2`
-   Support running `buildUrl`, `parseUrl(CALL::)`, `parse(get/post/@null)`, `require(include online js library)`
-   Support `header(cookie/referer)`, `ua` configurations
-   Support `hots`, `updates`, `tags`, `tag(subtag)`, `search`, `book[12345678](sections)`, `section[123]` nodes

---

## API

```js
/**
* Outputs nodes' data to console on Nodejs.
* @param sitedPath: A string of .sited or .sited.xml file's path, advises to absolute path.
* @param key: A keyword string that is used for searching on search node.
* @param callback: Outputs the entrance test functions of home/search/book node.
* @param nodeName@doTest@home_test: The string 'hots', 'updates' or 'tags', which starts test function of hots/updates/tag node.
* @param bookUrl@book_test: url argument of book node function, for test of book node alone.
*/
sited_test(
    sitedPath: string,
    key: string,
    callback: (
        home_test?: (
            cback: (
                doTest: (nodeName: 'hots' | 'updates' | 'tags', cb: () => Promise<void>
                ) => Promise<void>
            ) => Promise<void>
        ) => Promise<void>,
        search_test?: (cb: () => Promise<void>) => Promise<void>,
        book_test?: (bookUrl: string, from_where: 'from_外部传值', cb: () => Promise<void>) => Promise<void>
    ) => Promise<void>
): Promise<void>;
```

---

### [ [Features](#Features)|[ API ](#API)|[Usage](#Usage)|[Configuration](#Configuration)|[Dependencies](#Dependencies)|[Todo](#Todo)|[ChangeLog](#ChangeLog)|[SpecialThanks](#SpecialThanks)|[Links](#Links)]

---

## Usage

> #### 1.After npm installs the project locally as `npm i sited_test --production`

A. Uses Node to run a js script like demo.js which requires the API within the sited_test directory.

```js
// demo.js, has written file path of .sited or .sited.xml
async () => {
    var sited_test = require('./index');
    var path = require('path');
    var sitedPath = path.join(__dirname, 'demo.sited.xml');
    var key = '我们';
    await sited_test(
        sitedPath,
        key,
        async (home_test, search_test, book_test) => {
            async function cb() {}
            // let bookUrl = 'http:// book节点函数的url参数';
            // await book_test(bookUrl, 'from_外部传值', cb);
            async function cback(doTest) {
                await doTest('hots', cb);
                await doTest('updates', cb);
                await doTest('tags', cb);
            }
            await home_test(cback);
            await search_test(cb);
            console.log('-----结束测试本插件-----\n');
        }
    );
};
```

```bash
cd /path/to/node_modules/sited_test
node demo.js
```

or B.

```bash
# need not to cd
node /path/to/node_modules/sited_test/bin.js <sitedPath> [<key>]

# sitedPath: File path of .sited or .sited.xml.
# key(optional): A keyword string that is used for searching on search node, if not be inputted, built-in keyword of bin.js would be used.
```

or C. By the way, using [Code Runner extension](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner) or built-in debugger to call Node is quick, when you are editing sited plugin file on VS Code.

a. You can start Code Runner when editor focuses sited plugin file, after configuring Code Runner to execute .sited and .sited.xml as node command below, test the plugin directly, need not to write the plugin path, it will be identified by \$fullFileName.

```json
"code-runner.executorMapByGlob": {
    "*.{sited,sited.xml}": "node --unhandled-rejections=strict /path/to/node_modules/sited_test/bin.js $fullFileName key"
}
// replace /path/to/node_modules/sited_test/bin.js with actual bin.js's path. If (key) be deleted, that built-in keyword of bin.js would be used.
```

or b. You can start debugging (sited_test) when editor focuses sited plugin file, after adding a debug configure to execute as node command below, test the plugin directly, need not to write the plugin path, it will be identified by \${file}.If you want to VS Code set breakpoints and pause in js code of plugin xml file, must add `debugger;` statements outside global functions and in every function you want to pause.

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
            "args": ["${file}", "关键词"]
        }
    ]
}
```

replace /path/to/node_modules/sited_test/bin.js with actual bin.js's path. If `"关键词"` was deleted, that built-in keyword of bin.js would be used.

> #### or 2. After npm installs the project globally as `npm i sited_test -g`
>
> input single `sited_test` on CLI will get:

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

## Configuration

-   `npm run test`: Within the project directory on CLI, run this code, will test a demo sited plugin and output result to console.
-   `npm run clean`: Within the project directory on CLI, run this code, will delete the log files and cache directory which made after running the project, only you had installed rimraf with `npm i rimraf -g` firstly.
-   Configuration which controls sited_log.txt/sited_error.txt/sited_print.txt and sited (cache directory) making under the project directory, see in index.js file.

---

## Dependencies

-   [Nodejs](https://nodejs.org/en/) 12 or above, must support ES2018+

---

## Todo:

-   Support login node

---

## ChangeLog

v1.2 Many improvements, change to use async/await syntax, support section node from book[8] node.<br />
v1 Release

---

## SpecialThanks

### The lib library(excludes main_res_raw_xx.js) is totally translated from big parts of Noear's open source [SiteD Engine](https://github.com/noear/SiteD) v35 APP JAVA code to JavaScript language by me. Thank you!

---

## Links

-   [SiteD plugin center](http://sited.noear.org/): Official SiteD plugin center.

-   [ddcat_plugin_develop](https://www.kancloud.cn/magicdmer/ddcat_plugin_develop): Knowledge about sited plugin development.

-   [DDCat SiteD](https://github.com/Yinr/DDCa-SiteD.vscode-ext): Syntax extension for VS Code, enabled .sited and .sided.xml files in sited language, support syntax highlight.

-   [generators-sited-plugin](https://github.com/htynkn/generators-sited-plugin): Yeoman generator for sited plugin.
