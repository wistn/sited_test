/*
 * Author:wistn
 * since:2020-03-31
 * LastEditors:Do not edit
 * LastEditTime:2020-04-23
 * Description:
 */
var sited_test = require('./index.js'); // 该文件里面有配置
var async = require('async');
var path = require('path');
var fs = require('fs');
var key = '我们'; // 这里填搜索关键字
console.log(
    '// 该demo不是全部节点正常的，一来插件者未及时修复，二来也可以展示插件坏掉效果（会具体打印到失效节点的函数名）'
);
var sitedPath = path.join(__dirname, 'demo.sited.xml');
// var sitedPath = '单个插件的绝对路径.sited.xml';(如果不懂fs模块相对路径的坑建议替换为绝对路径)
execute(sitedPath, key, () => {});
var fileDir = '多个插件所在文件夹路径'; // 这里可以填多个插件共同所在的文件夹路径，后面几行注释的内容在取消注释后为多个插件批量测试模式(同时要注释上面一行execute(sitedPath, key, () => {}))，保留注释则只测试上面sitedPath填写的插件

// var fileNames = fs
//     .readdirSync(fileDir)
//     .filter((item) => item.match(/.+\.sited(\.xml)?$/));
// fileNames.unshift(sitedPath);
// async.eachSeries(fileNames, (name, asyncCallback) => {
//     sitedPath = path.resolve(fileDir, name);
//     execute(sitedPath, key, () => asyncCallback());
// });
function execute(sitedPath, key, callback) {
    sited_test(
        sitedPath,
        key,
        (
            home_test,
            search_test,
            book_test,
            tag_test,
            section_test,
            subtag_test
        ) => {
            let bookUrl =
                'http://comic.oacg.cn/index.php?m=Index&a=comicinfo&comic_id=MEbIk7ReT0CuK1vP21DMcQ';
            async.series(
                [
                    // async.apply(book_test, bookUrl, 'from_外部传值'),
                    (asyncCallback) => {
                        home_test((doTest) => {
                            async.series(
                                [
                                    async.apply(doTest, 'hots'),
                                    async.apply(doTest, 'updates'),
                                    async.apply(doTest, 'tags')
                                    // 每个入口流程测试，会运行到最终section/book节点，不想测试的入口可以注释，也可以取消bookUrl所在注释直接测试book节点（bookUrl填写书目资源的url）
                                ],
                                () => asyncCallback()
                            );
                        });
                    },
                    async.apply(search_test)
                ],
                () => callback(console.log('结束测试本插件'))
            );
        }
    );
}
