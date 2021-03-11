#!/usr/bin/env node
/*
 * Author:wistn
 * since:2020-03-31
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
    var sitedPath = null;
    var key = null;
    async function execute(sitedPath, key, exeCback) {
        key = key || '我们'; // 这里填默认搜索关键字，当外部运行本文件没加上搜索参数时使用。

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
    var yargs = require('yargs')
        .wrap(require('yargs').terminalWidth())
        .usage(
            'Tests own SiteD plugin on Nodejs\n\nsitedPath: File path of .sited or .sited.xml.\nkey(optional): A keyword string that is used for searching on search node, if not be inputted, built-in keyword of bin.js would be used.\n'
        )
        .usage('Usage: sited_test <sitedPath> [key]')
        .usage('Usage: sited_test [options]')
        .version()
        .help('help') // 没有连字符也会隐式响应help命令，但和其他有效参数组合输入就不会了
        .option('demo', {
            description: 'Tests a demo.sited.xml plugin'
        })
        .example(
            'sited_test /path/to/sited.sited.xml',
            "#Outputs nodes' data to console on Nodejs."
        );
    var argv = yargs.argv;
    var args = argv._;
    if (argv.demo) {
        sitedPath = path.resolve(__dirname, 'demo.sited.xml');
        console.log(
            '// 该demo不是全部节点正常的，一来插件者未及时修复，二来也可以展示插件坏掉效果（会具体到失效节点的函数名）'
        );
        await execute(sitedPath, null, exeCback);
    } else if (args.length) {
        for (var i = 0; i < args.length; i++) {
            var item = String(args[i]);
            if (
                item.match(/.+sited\.xml$/) &&
                fs.existsSync(path.resolve(__dirname, item))
            ) {
                sitedPath = path.resolve(__dirname, item);
                if (args.length == 1) {
                    key = null;
                } else if (i < args.length - 1) {
                    key = String(args[i + 1]);
                } else {
                    key = String(args[i - 1]);
                }
                await execute(sitedPath, key, exeCback);
                break;
            }
        }
        if (!sitedPath) {
            console.error('error: .sited.xml or .sited file required');
            process.exit(1);
        }
    } else {
        yargs.showHelp();
        process.exit();
    }
    LogWriter.tryClose();
    console.log('-----结束测试引擎-----');
})();
