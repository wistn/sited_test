#!/usr/bin/env node
/*
 * Author:wistn
 * since:2020-09-29
 * LastEditors:Do not edit
 * LastEditTime:2021-03-08
 * Description:
 */
(async () => {
    process.on('unhandledRejection', (reason) => {
        console.log(reason);
        process.exit(1);
    });
    var { sited_test, LogWriter } = require('./index'); // 该文件里面有配置
    var path = require('path');
    var fs = require('fs');
    async function noop(...args) {}
    var exeCback = noop; // 拓展功能的回调函数
    var sitedPath = path.resolve(__dirname, 'demo.sited.xml'); // 或'单个插件的绝对路径.sited.xml',如果不懂fs模块相对路径的坑建议替换为绝对路径。
    var key = '我们'; // 这里填搜索关键字
    async function execute(sitedPath, key, exeCback) {
        await sited_test(
            sitedPath,
            key,
            async (
                home_test,
                search_test,
                book_test,
                tag_test,
                section_test,
                subtag_test
            ) => {
                async function cb(...args) {
                    console.log('-----结束测试本入口节点-----');
                }
                async function cback(doTest) {
                    if (doTest) {
                        await doTest('hots', cb);
                        await doTest('updates', cb);
                        await doTest('tags', cb);
                    }
                }
                // 每个入口流程测试，会运行到最终section/book节点，不想测试的入口可以注释，也可以取消bookUrl所在注释直接测试book节点（bookUrl填写书目资源的url）
                await home_test(cback);
                await search_test(cb);
                // var bookUrl =
                //     'http://comic.oacg.cn/index.php?m=Index&a=comicinfo&comic_id=MEbIk7ReT0CuK1vP21DMcQ';
                // await book_test(bookUrl, 'from_外部传值', cb);
                console.log('-----结束测试本插件-----\n');
            }
        );
    }
    console.log(
        '// 该demo不是全部节点正常的，一来插件者未及时修复，二来也可以展示插件坏掉效果（会具体到失效节点的函数名）'
    );
    await execute(sitedPath, key, exeCback);
    var sitedDirPath = '多个插件所在文件夹路径';
    // 这里可以填多个插件共同所在的文件夹路径，后面几行注释的内容在取消注释后为多个插件批量测试模式(同时要注释上面一行 await execute(sitedPath, key, exeCback) ，保留注释则只测试上面sitedPath填写的插件

    // var fileNames = fs.readdirSync(sitedDirPath);
    // fileNames = fileNames.filter((item) => item.match(/.+\.sited\.xml$/));
    // for (var name of fileNames.slice(0,3)) {
    //     sitedPath = path.resolve(sitedDirPath, name);
    //     await execute(sitedPath, key, exeCback);
    // }
    LogWriter.tryClose();
    console.log('-----结束测试引擎-----');
})();
