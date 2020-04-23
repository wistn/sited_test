/*
 * Author:wistn
 * since:2020-03-26
 * LastEditors:Do not edit
 * LastEditTime:2020-04-24
 * Description:
 */

exports = module.exports = function (sitedPath, key, callback) {
    Map.prototype.toJson = function () {
        let obj = Object.create(null);
        for (let [k, v] of this) {
            obj[k] = v;
        }
        return JSON.stringify(obj);
    };
    String.prototype.hashCode = function () {
        let h;
        for (let i = 0; i < this.length; i++) {
            h = (Math.imul(31, h) + this.charCodeAt(i)) | 0;
        }
        return h;
    };
    var fs = require('fs');
    var App = require('./lib/org_noear_siteder_App.js');
    var DdSource = require('./lib/org_noear_siteder_dao_engine_DdSource.js');
    var MainViewModel = require('./lib/org_noear_siteder_viewModels_site_MainViewModel.js');
    var TagViewModel = require('./lib/org_noear_siteder_viewModels_site_TagViewModel.js');
    var SearchViewModel = require('./lib/org_noear_siteder_viewModels_site_SearchViewModel.js');
    var BookViewModel = require('./lib/org_noear_siteder_viewModels_site_BookViewModel.js');
    var Book4ViewModel = require('./lib/org_noear_siteder_viewModels_site_Book4ViewModel.js');
    var Book5ViewModel = require('./lib/org_noear_siteder_viewModels_site_Book5ViewModel.js');
    var Book6ViewModel = require('./lib/org_noear_siteder_viewModels_site_Book6ViewModel.js');
    var Book7ViewModel = require('./lib/org_noear_siteder_viewModels_site_Book7ViewModel.js');
    var Book8ViewModel = require('./lib/org_noear_siteder_viewModels_site_Book8ViewModel.js');
    var Section1ViewModel = require('./lib/org_noear_siteder_viewModels_site_Section1ViewModel.js');
    var Section2ViewModel = require('./lib/org_noear_siteder_viewModels_site_Section2ViewModel.js');
    var Section3ViewModel = require('./lib/org_noear_siteder_viewModels_site_Section3ViewModel.js');
    var SectionModel = require('./lib/org_noear_siteder_models_SectionModel.js');
    var BookNode = require('./lib/org_noear_siteder_dao_db_BookNode.js');
    // 配置说明：1. 多多猫缓存中的文本缓存sited文件夹在本引擎也默认对应生成（测试插件后在本引擎根目录下出现，注意有时插件节点没返回数据时可以删除这个文件夹看看）。开启缓存后，异步请求的网页在有效期内再次请求才是同步。如要禁止缓存，可对下行注释，作用于org_noear_sited___FileCache.js;
    global.enableFileCache = true;

    // 2. SiteD插件容器/多多猫安卓版设置中有开发者模式开关，控制是否生成sited_log.txt/sited_error.txt/sited_print.txt文件。多多猫里默认为假，本js版引擎默认为真即生成（测试插件后在本引擎根目录下出现），如要禁止生成，可取消下行注释，作用于org_noear_siteder_dao_Setting.js;
    global.isDeveloperModel = true;

    // 3. 上面1项为真（生成）的前提下，SiteD插件文件中开头的debug参数(1/0)，会控制本引擎生成的sited_log.txt中是否显示各节点parse解析后返回的数据，为0时只显示节点parse/parseUrl所要解析的网址，不影响sited_error.txt/sited_print.txt文件。
    // 4. Log模块(android_util_Log.js)是本js版引擎模仿安卓logcat功能转储消息日志，默认生成到logcat_stdout.txt（测试插件后在本引擎根目录下出现），不受上面2项开关参数的影响且显示消息日志过程会更加丰富。
    // 5. 上面1项中，其中VERBOSE类型日志消息写入logcat_stdout文件时，如要同时console.log打印（每条消息开头部分）到运行本引擎的控制台，取消以下VERBOSE_log注释。也可以取消VERBOSE_trace的注释来打印堆栈跟踪
    // global.VERBOSE_log = 1;
    // global.VERBOSE_trace = 1;

    // ::1.实例化插件引擎 String sited = HttpUtil.get("http://x.x.x/xxx.sited.xml");或者从本地加载插件。
    var sited = fs.readFileSync(sitedPath, 'utf8');
    new App().onCreate();
    var source = new DdSource(App.getCurrent(), sited);
    console.log(
        new Date().toLocaleTimeString(),
        '开始测试插件 ' + source.title + '.v' + source.ver
    ); // 打印本地时间

    // ::2.使用插件引擎获取数据
    var isUpdate = true; // 是否(不读取缓存)刷新
    callback(
        home_test,
        search_test,
        book_test,
        tag_test,
        section_test,
        subtag_test
    );
    function home_test(cback) {
        var doTest = (nodeName, cb) => {
            var list = viewModel[nodeName.replace('s', 'List')];
            for (let i in list) {
                if (i == '0') {
                    console.log(
                        '\n获取插件首面' +
                            nodeName +
                            '节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                    );
                    if (nodeName == 'hots' || nodeName == 'updates')
                        console.log(
                            JSON.stringify(list.slice(0, 2)) + ' ...\n'
                        );
                    else
                        console.log(
                            JSON.stringify(list.slice(0, 6)) + ' ...\n'
                        );
                    // 对于返回数据截取前几条打印节省空间，下同。
                }
                if (list[i].url) {
                    if (nodeName == 'hots' || nodeName == 'updates') {
                        if (source.engine >= 22) {
                            if (source.tag(list[i].url).isMatch(list[i].url)) {
                                tag_test(list[i].url, 'from_' + nodeName, cb);
                            } else {
                                book_test(list[i].url, 'from_' + nodeName, cb);
                            }
                        } else {
                            book_test(list[i].url, 'from_' + nodeName, cb);
                        }
                    } else if (nodeName == 'tags') {
                        tag_test(list[i].url, 'from_' + nodeName, cb);
                    }
                    return; // doTest函数内后面兜底的callback调用被停掉，下同
                }
            }
            cb(); // doTest函数内兜底的callback，下同
        };
        var viewModel = new MainViewModel();
        source.getNodeViewModel(viewModel, source.home, isUpdate, (code) => {
            // code == 1，表示请求的html有返回但不代表解析出正确数据
            if (code == 1) cback(doTest);
            else cback((nothing, cb) => cb());
        });
    }

    function search_test(cb) {
        if (!source.search.onParse) {
            cb();
        } else {
            console.log('\nsearch节点搜索关键词为 ' + key);
            var doTest = () => {
                for (let i in viewModel.list) {
                    if (i == '0') {
                        console.log(
                            '\n获取search节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                        );
                        console.log(
                            JSON.stringify(viewModel.list.slice(0, 2)) +
                                ' ...\n'
                        );
                    }
                    if (viewModel.list[i].url) {
                        if (source.engine >= 26) {
                            if (
                                source
                                    .tag(viewModel.list[i].url)
                                    .isMatch(viewModel.list[i].url)
                            ) {
                                tag_test(
                                    viewModel.list[i].url,
                                    'from_search',
                                    cb
                                );
                            } else {
                                book_test(
                                    viewModel.list[i].url,
                                    'from_search',
                                    cb
                                );
                            }
                        } else {
                            book_test(viewModel.list[i].url, 'from_search', cb);
                        }
                        return;
                    }
                }
                cb();
            };
            var viewModel = new SearchViewModel();
            source.getNodeViewModel(
                viewModel,
                false,
                key,
                1,
                source.search,
                (code) => {
                    if (code == 1) doTest();
                    else cb();
                }
            );
        }
    }

    function tag_test(tagUrl, from_where, cb) {
        console.log(
            '\ntag节点<' +
                from_where +
                '> ' +
                source.tag(tagUrl).onParse +
                '(或[若有]buildUrl/parseUrl)参数url为 ' +
                tagUrl
        );
        var doTest = () => {
            for (let i in viewModel.list) {
                if (i == '0') {
                    console.log(
                        '\n获取tag节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                    );
                    console.log(
                        JSON.stringify(viewModel.list.slice(0, 2)) + ' ...\n'
                    );
                }
                if (viewModel.list[i].url) {
                    if (
                        source
                            .subtag(viewModel.list[i].url)
                            .isMatch(viewModel.list[i].url)
                    ) {
                        subtag_test(
                            viewModel.list[i].url,
                            'from_tag_' + from_where,
                            cb
                        );
                    } else {
                        book_test(
                            viewModel.list[i].url,
                            'from_tag_' + from_where,
                            cb
                        );
                    }
                    return;
                }
            }
            cb();
        };
        var viewModel = new TagViewModel();
        source.getNodeViewModel(
            viewModel,
            false,
            viewModel.currentPage,
            tagUrl,
            source.tag(tagUrl),
            (code) => {
                if (code == 1) doTest();
                else cb();
            }
        );
    }

    function book_test(bookUrl, from_where, cb) {
        var config = source.book(bookUrl);
        console.log(
            '\nbook节点<' +
                from_where +
                '> ' +
                config.onParse +
                '(或[若有]buildUrl/parseUrl)参数url为 ' +
                bookUrl
        );
        if (bookUrl.startsWith('sited://') || config.isWebrun()) {
            console.log('结果是用app打开 ' + config.getWebUrl(bookUrl));
            cb();
            return;
        }
        var dtype = config.dtype();
        if (dtype < 4) {
            var doTest = () => {
                console.log(
                    '\n获取book[dtype=' +
                        dtype +
                        ']节点数据如下（属性可能和sited_log.txt的有点不一样，为BookViewModel属性最终值），详细数据见生成的logcat_stdout文件和sited_log.txt等'
                );
                var viewModel0 = viewModel;
                console.log(
                    (viewModel0.name != null
                        ? 'name:' + JSON.stringify(viewModel0.name) + ' ,\n'
                        : '') +
                        (viewModel0.author != null
                            ? 'author:' +
                              JSON.stringify(viewModel0.author) +
                              ' ,\n'
                            : '') +
                        (viewModel0.intro != null
                            ? 'intro:' +
                              JSON.stringify(viewModel0.intro.slice(0, 40)) +
                              ' ... ,\n'
                            : '') +
                        (viewModel0.logo != null
                            ? 'logo:' + JSON.stringify(viewModel0.logo) + ' ,\n'
                            : '') +
                        (viewModel0.updateTime != null
                            ? 'updateTime:' +
                              JSON.stringify(viewModel0.updateTime) +
                              ' ,\n'
                            : '') +
                        (viewModel0.isSectionsAsc != null
                            ? 'isSectionsAsc:' +
                              (viewModel0.isSectionsAsc == true ? 1 : 0) +
                              ' ,\n'
                            : '') +
                        (viewModel0.sections != null
                            ? 'sections:' +
                              JSON.stringify(viewModel0.sections.slice(0, 2)) +
                              ' ...\n'
                            : '')
                );
                for (let i in viewModel.sections) {
                    if (viewModel.sections[i].url) {
                        section_test(
                            viewModel.sections[i].url,
                            'from_book_' + from_where,
                            cb
                        );
                        return;
                    }
                }
                cb();
            };
            var viewModel = new BookViewModel(source, new BookNode(bookUrl));
            source.getNodeViewModel(
                viewModel,
                isUpdate,
                bookUrl,
                source.book(bookUrl),
                (code) => {
                    if (code == 1) doTest();
                    else cb();
                }
            );
        } else {
            var doTest = () => {
                console.log(
                    '\n获取book[dtype=' +
                        dtype +
                        ']节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                );
                var viewModel0 = viewModel;
                viewModel0.source = '省略';
                viewModel0.node = '省略';
                for (let i in viewModel0) {
                    if (Array.isArray(viewModel0[i])) {
                        viewModel0[i] = viewModel0[i].slice(0, 2);
                        // 对于返回数据截取前几条打印节省空间，下同。
                    }
                }
                console.log(JSON.stringify(viewModel0) + ' ...\n');
                cb();
            };
            if (4 <= dtype && dtype <= 7) {
                if (dtype == 4) {
                    var viewModel = new Book4ViewModel(
                        source,
                        new BookNode(bookUrl)
                    );
                } else if (dtype == 5) {
                    var viewModel = new Book5ViewModel(
                        source,
                        new BookNode(bookUrl)
                    );
                } else if (dtype == 6) {
                    var viewModel = new Book6ViewModel(
                        source,
                        new BookNode(bookUrl)
                    );
                } else if (dtype == 7) {
                    var viewModel = new Book7ViewModel(new BookNode(bookUrl));
                }
                source.getNodeViewModel(
                    viewModel,
                    isUpdate,
                    bookUrl,
                    source.book(bookUrl),
                    (code) => {
                        if (code == 1) doTest();
                        else cb();
                    }
                );
            } else if (dtype == 8) {
                var viewModel = new Book8ViewModel(
                    source,
                    new BookNode(bookUrl)
                );
                let args = new Map([
                    ['key1', '0'],
                    ['n1', '1']
                ]); // 模拟book[dtype=8]的输入框输入了1或者0
                console.log('模拟book[dtype=8]对输入框key1或n1输入了', args);
                source.getNodeViewModel(
                    viewModel,
                    isUpdate,
                    bookUrl,
                    source.book(bookUrl),
                    args,
                    (code) => {
                        if (code == 1) doTest();
                        else cb();
                    }
                );
            }
        }
    }

    function section_test(sectionUrl, from_where, cb) {
        var config = source.section(sectionUrl);
        console.log(
            '\nsection节点<' +
                from_where +
                '> ' +
                config.onParse +
                '(或[若有]buildUrl/parseUrl)参数url为 ' +
                sectionUrl
        );
        if (sectionUrl.startsWith('sited://') || config.isWebrun()) {
            console.log('结果是用app打开 ' + config.getWebUrl(sectionUrl));
            cb();
            return;
        }
        var doTest = () => {
            console.log(
                '\n获取section[dtype=' +
                    dtype +
                    ']节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
            );
            var viewModel0 = viewModel;
            if (viewModel0.newItems) viewModel0.newItems = '省略';
            for (let i in viewModel0) {
                if (Array.isArray(viewModel0[i])) {
                    viewModel0[i] = viewModel0[i].slice(0, 2);
                }
            }
            console.log(JSON.stringify(viewModel0) + ' ...\n');
            cb();
        };
        var dtype = config.dtype();
        if (dtype == 1) {
            var viewModel = new Section1ViewModel();
        } else if (dtype == 2) {
            var viewModel = new Section2ViewModel(new SectionModel());
        } else if (dtype == 3) {
            var viewModel = new Section3ViewModel();
        }
        source.getNodeViewModel(
            viewModel,
            false,
            sectionUrl,
            source.section(sectionUrl),
            (code) => {
                if (code == 1) doTest();
                else cb();
            }
        );
    }

    function subtag_test(subtagUrl, from_where, cb) {
        console.log(
            '\nsubtag节点<' +
                from_where +
                '> ' +
                source.subtag(subtagUrl).onParse +
                '(或[若有]buildUrl/parseUrl)参数url为 ' +
                subtagUrl
        );
        var doTest = () => {
            for (let i in viewModel.list) {
                if (i == '0') {
                    console.log(
                        '\n获取subtag节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                    );
                    console.log(
                        JSON.stringify(viewModel.list.slice(0, 2)) + ' ...\n'
                    );
                }
                if (viewModel.list[i].url) {
                    book_test(
                        viewModel.list[i].url,
                        'from_subtag_' + from_where,
                        cb
                    );
                    return;
                }
            }
            cb();
        };
        var viewModel = new TagViewModel();
        source.getNodeViewModel(
            viewModel,
            false,
            viewModel.currentPage,
            subtagUrl,
            source.subtag(subtagUrl),
            (code) => {
                if (code == 1) doTest();
                else cb();
            }
        );
    }
};
