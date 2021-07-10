var fs = require('fs');
var {
    App,
    DdSource,
    MainViewModel,
    SearchViewModel,
    TagViewModel,
    BookViewModel,
    Book4ViewModel,
    Book5ViewModel,
    Book6ViewModel,
    Book7ViewModel,
    Book8ViewModel,
    Section1ViewModel,
    Section2ViewModel,
    Section3ViewModel,
    SectionModel,
    BookNode,
    LogWriter
} = require('sited_js'); // 该文件里面有配置
exports = module.exports = {
    LogWriter: LogWriter,
    sited_test: async function sited_test(sitedPath, key, callback) {
        // ::1.实例化插件引擎 String sited = HttpUtil.get("http://x.x.x/xxx.sited.xml") js版要回调；或者从本地加载插件。
        var sited = fs.readFileSync(sitedPath, 'utf8');
        new App().onCreate();
        var source = await new DdSource(App.getCurrent(), sited);
        console.log(
            new Date().toLocaleTimeString() +
                ' 开始运行插件 ' +
                source.title +
                '.v' +
                String(source.ver) +
                ' @' +
                source.author +
                ' schema' +
                String(source.schema) +
                ' dtype' +
                String(source.body.dtype())
        ); // 打印本地时间
        // ::2.使用插件引擎获取数据
        var isUpdate = true; // 是否(不读取缓存)刷新
        async function home_test(cback) {
            console.log(
                '插件首面可运行' +
                    (source.hots.name ? 'hots ' : '') +
                    (source.updates.name ? 'updates ' : '') +
                    (source.tags.name ? 'tags ' : '') +
                    '节点'
            );
            async function doTest(nodeName, cb) {
                if (!source[nodeName].name) {
                    console.log(nodeName + '节点不在插件里');
                    await cb();
                    return;
                }
                var nodeList = viewModel[nodeName.replace('s', 'List')];
                console.log(
                    '\n获取' +
                        nodeName +
                        '节点数据如下（属性和sited_log.txt的有点不一样，为viewModel属性最终值，下同），详细数据见生成的logcat_stdout文件和sited_log.txt等。'
                );
                console.log(
                    JSON.stringify(
                        nodeName == 'hots' || nodeName == 'updates'
                            ? nodeList.slice(0, 2)
                            : nodeList.slice(0, 6)
                    ) + ' ......'
                );
                // 对于返回数据截取前几条打印节省空间，下同。
                for (let i in nodeList) {
                    if (nodeList[i].url) {
                        if (nodeName == 'hots' || nodeName == 'updates') {
                            if (source.engine >= 22) {
                                // 支持是分类的可能
                                if (
                                    source
                                        .tag(nodeList[i].url)
                                        .isMatch(nodeList[i].url)
                                ) {
                                    await tag_test(
                                        nodeList[i].url,
                                        'from_' + nodeName,
                                        cb
                                    );
                                } else {
                                    await book_test(
                                        nodeList[i].url,
                                        'from_' + nodeName,
                                        cb
                                    );
                                }
                            } else {
                                await book_test(
                                    nodeList[i].url,
                                    'from_' + nodeName,
                                    cb
                                );
                            }
                        } else if (nodeName == 'tags') {
                            await tag_test(
                                nodeList[i].url,
                                'from_' + nodeName,
                                cb
                            );
                        }
                        return; // doTest函数内后面兜底的返回被停掉，下同
                    }
                }
                await cb(); // doTest函数内兜底的返回，下同
            }
            var viewModel = new MainViewModel();
            await source.getNodeViewModel(
                viewModel,
                source.home,
                isUpdate,
                async (code) => {
                    // code == 1 表示请求url有返回html但不代表节点解析出正确数据; code == -1 表示请求url没有响应; code == -2 表示请求url过程出错且没有缓存;
                    if (code == 1) {
                        await cback(doTest);
                    } else {
                        // 只要有部分有数据就加载（可能会有部分加载出错）
                        if (viewModel.total() > 0) {
                            await cback(doTest);
                        } else {
                            console.log('网络请求出错 R.string.error_net');
                            await cback(null);
                        }
                    }
                }
            );
        }

        async function search_test(cb) {
            if (!source.search.name) {
                console.log('search节点不在插件里');
                await cb();
                return;
            }
            console.log(
                '\nsearch节点url属性为 ' +
                    String(source.search.url.value) +
                    ' 搜索关键字为 ' +
                    key
            );
            async function doTest() {
                console.log(
                    '\n获取search节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                );
                console.log(
                    JSON.stringify(viewModel.list.slice(0, 2)) + ' ......'
                );
                for (let i in viewModel.list) {
                    if (viewModel.list[i].url) {
                        if (source.engine >= 26) {
                            if (
                                source
                                    .tag(viewModel.list[i].url)
                                    .isMatch(viewModel.list[i].url)
                            ) {
                                await tag_test(
                                    viewModel.list[i].url,
                                    'from_search',
                                    cb
                                );
                            } else {
                                await book_test(
                                    viewModel.list[i].url,
                                    'from_search',
                                    cb
                                );
                            }
                        } else {
                            await book_test(
                                viewModel.list[i].url,
                                'from_search',
                                cb
                            );
                        }
                        return;
                    }
                }
                await cb();
            }
            var viewModel = new SearchViewModel();
            await source.getNodeViewModel(
                viewModel,
                false,
                key,
                1,
                source.search,
                async (code) => {
                    // code == -3 表示节点url是空的且没有动态子项目; 其余code含义和home节点的一样
                    if (viewModel.total() == 0) {
                        if (code < 0) {
                            console.log('网络请求出错 R.string.error_net');
                        } else {
                            console.log(
                                '没有符合条件的内容 R.string.hint_search_no'
                            );
                        }
                    }
                    if (code == 1) {
                        await doTest();
                    } else {
                        await cb();
                    }
                }
            );
        }

        async function tag_test(tagUrl, from_where, cb) {
            if (!source._tag.name) {
                console.log('tag节点不在插件里');
                await cb();
                return;
            }
            console.log(
                '\ntag节点<' +
                    from_where +
                    '> ' +
                    source.tag(tagUrl).onParse +
                    '(或[若有]buildUrl/parseUrl)参数url为 ' +
                    tagUrl
            );
            async function doTest() {
                console.log(
                    '\n获取tag节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                );
                console.log(
                    JSON.stringify(viewModel.list.slice(0, 2)) + ' ......'
                );
                for (let i in viewModel.list) {
                    if (viewModel.list[i].url) {
                        if (
                            source
                                .subtag(viewModel.list[i].url)
                                .isMatch(viewModel.list[i].url)
                        ) {
                            await subtag_test(
                                viewModel.list[i].url,
                                'from_tag_' + from_where,
                                cb
                            );
                        } else {
                            await book_test(
                                viewModel.list[i].url,
                                'from_tag_' + from_where,
                                cb
                            );
                        }
                        return;
                    }
                }
                await cb();
            }
            var viewModel = new TagViewModel();
            await source.getNodeViewModel(
                viewModel,
                false,
                viewModel.currentPage,
                tagUrl,
                source.tag(tagUrl),
                async (code) => {
                    // code == -3 表示节点url是空的且没有动态子项目; 其余code含义和home节点的一样
                    if (code == 1) {
                        await doTest();
                    } else {
                        console.log('网络请求出错 R.string.error_net');
                        await cb();
                    }
                }
            );
        }

        async function book_test(bookUrl, from_where, cb) {
            if (bookUrl.startsWith('sited://')) {
                console.log('结果是用app打开 ' + bookUrl);
                await cb();
                return;
            }
            if (!source.isMatch(bookUrl)) {
                console.log('book节点提示：此内容需要新的插件，现在安装？');
                console.log('暂时没有合适的插件');
                await cb();
                return;
            }
            var config = source.book(bookUrl);
            console.log(
                '\nbook节点<' +
                    from_where +
                    '> parse(或[若有]buildUrl/parseUrl)参数url为 ' +
                    bookUrl
            );
            if (config.isWebrun()) {
                console.log('结果是用app打开 ' + config.getWebUrl(bookUrl));
                await cb();
                return;
            }
            async function doTest() {
                if (!source._book.name) {
                    console.log('book节点不在插件里'); // 对应的多多猫提示 网络请求出错///^_^....... R.string.error_net
                    await cb();
                    return;
                }
                console.log(
                    '\n获取book[dtype=' +
                        String(dtype) +
                        ']节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                );
                if (dtype < 4) {
                    console.log(
                        'name:' +
                            (viewModel.name ? viewModel.name + ' ,' : '') +
                            '\nauthor:' +
                            (viewModel.author ? viewModel.author + ' ,' : '') +
                            '\nintro:' +
                            (viewModel.intro
                                ? viewModel.intro.slice(0, 20) + ' ...... ,'
                                : '') +
                            '\nlogo:' +
                            (viewModel.logo ? viewModel.logo + ' ,' : '') +
                            '\nupdateTime:' +
                            (viewModel.updateTime
                                ? viewModel.updateTime + ' ,'
                                : '') +
                            '\nisSectionsAsc:' +
                            (viewModel.isSectionsAsc == true ? '1 ,' : '0 ,') +
                            '\nsections:' +
                            JSON.stringify(viewModel.sections.slice(0, 2)) +
                            ' ......'
                    );
                    for (let i in viewModel.sections) {
                        if (viewModel.sections[i].url) {
                            await section_test(
                                viewModel.sections[i].url,
                                'from_book_' + from_where,
                                cb
                            );
                            return;
                        }
                    }
                    if (viewModel.name == null) {
                        console.log('网络请求出错 R.string.error_net');
                        await cb();
                        return;
                    }
                    if (viewModel.sectionCount() == 0) {
                        console.log(
                            '此内容已下架@_@?a R.string.error_no_content'
                        );
                    }
                    await cb();
                    return;
                } else {
                    if (dtype == 8) var tenItems = viewModel.items.slice(0, 10);
                    for (let k in viewModel) {
                        if (k == 'items' || k == 'pictures') {
                            viewModel[k] = viewModel[k].slice(0, 2);
                            for (let j in viewModel[k]) {
                                if (viewModel[k][j] && viewModel[k][j].section)
                                    viewModel[k][j].section = '省略';
                            }
                        } else if (
                            typeof viewModel[k] != 'string' &&
                            typeof viewModel[k] != 'number' &&
                            typeof viewModel[k] != 'boolean' &&
                            viewModel[k] != null
                        ) {
                            viewModel[k] = '省略';
                        }
                    }
                    console.log(JSON.stringify(viewModel) + ' ......');
                    if (dtype == 8) {
                        for (let i in tenItems) {
                            if (tenItems[i].url && tenItems[i].isSectionOpen) {
                                await section_test(
                                    tenItems[i].url,
                                    'from_book_' + from_where,
                                    cb
                                );
                                return;
                            }
                        }
                    }
                    await cb();
                }
            }
            async function SdSourceCallback(code) {
                // code == 99 表示login节点未登录; 其余code含义和home节点的一样
                if (code == 1) {
                    await doTest();
                } else {
                    if (code == 99) {
                        console.log('login节点未登录');
                        await cb();
                    } else {
                        console.log('网络请求出错 R.string.error_net');
                        await cb();
                    }
                }
            }
            var dtype = config.dtype();
            var node = new BookNode(bookUrl);
            var viewModel = null;
            if (dtype <= 7) {
                if (dtype < 4) {
                    viewModel = new BookViewModel(source, node);
                } else if (dtype == 4) {
                    viewModel = new Book4ViewModel(source, node);
                } else if (dtype == 5) {
                    viewModel = new Book5ViewModel(source, node);
                } else if (dtype == 6) {
                    viewModel = new Book6ViewModel(source, node);
                } else if (dtype == 7) {
                    viewModel = new Book7ViewModel(node);
                }
                await source.getNodeViewModel(
                    viewModel,
                    isUpdate,
                    bookUrl,
                    source.book(bookUrl),
                    SdSourceCallback
                );
            } else if (dtype == 8) {
                viewModel = new Book8ViewModel(source, node);
                var args = new Map();
                if (config.hasItems()) {
                    for (let item of config._items) {
                        console.log(
                            'book[8].item ' + item.attrs._items.toJson()
                        );
                        if (item.key) args.set(item.key, '0');
                    }
                }
                args.set('key1', '1');
                args.set('key2', '2');
                console.log(
                    'index.js 模拟book[dtype=8]填写输入框 ' + args.toJson()
                );
                await source.getNodeViewModel(
                    viewModel,
                    isUpdate,
                    bookUrl,
                    source.book(bookUrl),
                    args,
                    SdSourceCallback
                );
            }
        }

        async function section_test(sectionUrl, from_where, cb) {
            if (sectionUrl.startsWith('sited://')) {
                console.log('结果是用app打开 ' + sectionUrl);
                await cb();
                return;
            }
            var config = source.section(sectionUrl);
            console.log(
                '\nsection节点<' +
                    from_where +
                    '> parse(或[若有]buildUrl/parseUrl)参数url为 ' +
                    sectionUrl
            );
            if (config.isWebrun()) {
                console.log('结果是用app打开 ' + config.getWebUrl(sectionUrl));
                await cb();
                return;
            }
            async function doTest() {
                if (!source._section.name) {
                    console.log('section节点不在插件里');
                    await cb();
                    return;
                }
                console.log(
                    '\n获取section[dtype=' +
                        String(dtype) +
                        ']节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                );
                for (let k in viewModel) {
                    if (k == 'items') {
                        viewModel[k] = viewModel[k].slice(0, 2);
                        for (let i in viewModel[k]) {
                            if (viewModel[k][i] && viewModel[k][i].section) {
                                viewModel[k][i].section = '省略';
                            }
                        }
                    } else if (k == 'isSectionsAsc') {
                        viewModel[k] = '省略';
                    } else if (
                        typeof viewModel[k] != 'string' &&
                        typeof viewModel[k] != 'number' &&
                        typeof viewModel[k] != 'boolean' &&
                        viewModel[k] != null
                    ) {
                        viewModel[k] = '省略';
                    }
                }
                console.log(JSON.stringify(viewModel) + ' ......');
                await cb();
            }
            var viewModel = null;
            var dtype = config.dtype();
            if (dtype == 1) {
                viewModel = new Section1ViewModel();
                viewModel.currentSection = new SectionModel();
                viewModel.fromSection = new SectionModel();
            } else if (dtype == 2) {
                viewModel = new Section2ViewModel(new SectionModel());
            } else if (dtype == 3) {
                viewModel = new Section3ViewModel();
            }
            await source.getNodeViewModel(
                viewModel,
                false,
                sectionUrl,
                source.section(sectionUrl),
                async (code) => {
                    // code == 99 表示login节点未登录; 其余code含义和home节点的一样
                    if (code == 1) {
                        await doTest();
                    } else {
                        await cb();
                    }
                }
            );
        }

        async function subtag_test(subtagUrl, from_where, cb) {
            if (!source._subtag.name) {
                console.log('subtag节点不在插件里');
                await cb();
                return;
            }
            console.log(
                '\nsubtag节点<' +
                    from_where +
                    '> ' +
                    source.subtag(subtagUrl).onParse +
                    '(或[若有]buildUrl/parseUrl)参数url为 ' +
                    subtagUrl
            );
            async function doTest() {
                console.log(
                    '\n获取subtag节点数据如下，详细数据见生成的logcat_stdout文件和sited_log.txt等'
                );
                console.log(
                    JSON.stringify(viewModel.list.slice(0, 2)) + ' ......'
                );
                for (let i in viewModel.list) {
                    if (viewModel.list[i].url) {
                        await book_test(
                            viewModel.list[i].url,
                            'from_subtag_' + from_where,
                            cb
                        );
                        return;
                    }
                }
                await cb();
            }
            var viewModel = new TagViewModel();
            await source.getNodeViewModel(
                viewModel,
                false,
                viewModel.currentPage,
                subtagUrl,
                source.subtag(subtagUrl),
                async (code) => {
                    // code == -3 表示节点url是空的且没有动态子项目; 其余code含义和home节点的一样
                    if (code == 1) {
                        await doTest();
                    } else {
                        console.log('网络请求出错 R.string.error_net');
                        await cb();
                    }
                }
            );
        }

        await callback(
            home_test,
            search_test,
            book_test,
            tag_test,
            section_test,
            subtag_test
        );
    }
};
