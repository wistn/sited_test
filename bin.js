#!/usr/bin/env node --unhandled-rejections=strict
/*
 * Author:wistn
 * since:2020-03-31
 * LastEditors:Do not edit
 * LastEditTime:2020-04-23
 * Description:
 */
(function () {
    var sited_test = require('./index.js'); // 该文件里面有配置
    var async = require('async');
    var path = require('path');

    var yargs = require('yargs')
        .wrap(require('yargs').terminalWidth())
        .usage(
            'Tests own SiteD plugin on Nodejs\n\nsitedPath: File path of .sited or .sited.xml.\nkey(optional): A keyword string that is used for searching on search node, if not be inputted, built-in keyword of bin.js would be used.\n'
        )
        .usage('Usage: sited_test <sitedPath> [key]')
        .usage('Usage: sited_test [options]')
        .example(
            'sited_test /path/to/sited.sited.xml',
            "#Outputs nodes' data to console on Nodejs."
        )
        .help('help') // 没有连字符也会隐式响应help命令，但和其他有效参数组合输入就不会了
        .option('demo', {
            description: 'Tests a demo.sited.xml plugin'
        });
    var argv = yargs.argv;
    var args = argv._;
    if (argv.demo) {
        var sitedPath = path.join(__dirname, 'demo.sited.xml');
        console.log(
            '// 该demo不是全部节点正常的，一来插件者未及时修复，二来也可以展示插件坏掉效果（会具体打印到失效节点的函数名）'
        );
        execute(sitedPath, null);
    } else if (!args.length) {
        yargs.showHelp();
    } else {
        for (var i in args) {
            var item = args[i].toString();
            if (item.match(/.+\.sited(\.xml)?$/)) {
                var sitedPath = path.resolve(item);
                if (args[Number(i) + 1]) {
                    var key = args[Number(i) + 1];
                } else if (args[Number(i) - 1]) {
                    var key = args[Number(i) - 1];
                }
                execute(sitedPath, key);
                break;
            }
        }
        if (!sitedPath) {
            console.error('error: .sited.xml or .sited file required');
            process.exit(1);
        }
    }
    function execute(sitedPath, key) {
        key = (key || '我们').toString(); // 这里填默认搜索关键字，当外部运行本js文件时没加上搜索参数时使用。
        sited_test(
            sitedPath,
            key,
            (
                home_test,
                search_test,
                tag_test,
                book_test,
                section_test,
                subtag_test
            ) => {
                async.series(
                    [
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
            }
        );
    }
})();
