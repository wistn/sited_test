/*
 * Author:wistn
 * since:2019-09-13
 * LastEditors:Do not edit
 * LastEditTime:2020-04-24
 * Description:
 */

var Log = require('./android_util_Log.js');
var Util = require('./org_noear_sited_Util');
var SdAttributeList = require('./org_noear_sited_SdAttributeList');
var TextUtils = require('./mytool').TextUtils;
var SdApi = require('./org_noear_sited_SdApi');
var SdNodeSet = require('./org_noear_sited_SdNodeSet');
var JsEngine = require('./org_noear_sited_JsEngine');
var SdJscript = require('./org_noear_sited_SdJscript');
var __AsyncTag = require('./org_noear_sited___AsyncTag.js');
var DataContext = require('./org_noear_sited_DataContext.js');
var HttpMessage = require('./org_noear_sited_HttpMessage.js');
// var iconv = require('iconv-lite');
class SdSource {
    encode() {
        return this._encode;
    }
    ua() {
        if (TextUtils.isEmpty(this._ua)) {
            return Util.defUA;
        } else {
            return this._ua;
        }
    }
    cookies() {
        return this._cookies;
    }
    setCookies(cookies) {
        this._cookies = cookies;
    }
    delCache(key) {
        Util.cache.delete(key);
    }
    // --------------------------------
    constructor(app, xml) {
        this.attrs = new SdAttributeList();
        this.schema = 0;
        this.isDebug; // 是否为调试模式
        this.engine; // 引擎版本号
        this.url_md5;
        this.url; // 源首页
        this.title; // 标题
        this.expr; // 匹配源的表达式
        this._encode; // 编码
        this._ua;
        this._cookies;
        this.head;
        this.body;
        this.js; // 不能作为属性
        this.script;
        this.root;
        this.xmlBodyName;
        this.xmlHeadName;
        this.xmlScriptName;
        if (new.target.name != 'DdSource') this.doInit(app, xml);
        this.xmlHeadName = 'head';
        this.xmlBodyName = 'body';
        this.xmlScriptName = 'script';
        if (new.target.name != 'DdSource') this.doLoad(app);
    }
    doInit(app, xml) {
        Util.tryInitCache('app.getApplicationContext()');
        this.root = Util.getXmlroot(xml); // root为根节点sited。cheerio(元素名).children()只返回子元素节点，cheerio(元素名).contents()等于cheerio(元素名)[0].childNodes或.children返回数组还包括文本节点注释节点cdata节点。contents()的数组索引用中括号不用.eq(i)才能识别cdata内容
        {
            let temp = new Map(Object.entries(this.root.attr())); // cheerio(元素名).attr()即cheerio(元素名)[0].attribs返回没有长度的对象或者{}
            for (let [key, value] of temp) {
                this.attrs.set(key, value); // 存储元素的属性
            }
        }
        {
            let temp = this.root.contents();
            for (let i = 0, len = temp.length; i < len; i++) {
                var p = temp[i];
                if (
                    p.nodeType == 1 &&
                    Object.keys(p.attribs).length == 0 &&
                    p.children
                ) {
                    if (p.children.length == 1) {
                        var p2 = p.children[0];
                        if (p2.nodeType == 3) {
                            // 说明temp的子节点p是guid这种元素节点
                            this.attrs.set(p.tagName, p2.data);
                        }
                    }
                }
            }
        }

        this.schema = this.attrs.getInt('schema');
        this.engine = this.attrs.getInt('engine');
        this.isDebug = this.attrs.getInt('debug') > 0;
    }
    doLoad(app) {
        this.xmlHeadName = this.attrs.getString('head', this.xmlHeadName);
        this.xmlBodyName = this.attrs.getString('body', this.xmlBodyName);
        this.xmlScriptName = this.attrs.getString('script', this.xmlScriptName);

        // 1.head
        this.head = SdApi.createNodeSet(this, this.xmlHeadName);
        // this.head = new SdNodeSet(this);
        // 小心SdNode require循环
        this.head.buildForNode(Util.getElement(this.root, this.xmlHeadName));
        if (this.schema >= 1) {
            this.head.attrs.addAll(this.attrs);
        } else {
            this.head.attrs = this.attrs; // 旧版本没有head，所以把当前属性让给head
        }
        // 2.body
        this.body = SdApi.createNodeSet(this, this.xmlBodyName);
        // this.body = new SdNodeSet(this);小心require循环
        this.body.buildForNode(Util.getElement(this.root, this.xmlBodyName));
        this.title = this.head.attrs.getString('title');
        this.expr = this.head.attrs.getString('expr');
        this.url = this.head.attrs.getString('url');
        this.url_md5 = Util.md5(this.url);
        this._encode = this.head.attrs.getString('encode');
        this._ua = this.head.attrs.getString('ua');
        // ----------
        // 3.script :: 放后面
        //
        this.js = new JsEngine(app, this);
        this.script = new SdJscript(
            this,
            Util.getElement(this.root, this.xmlScriptName)
        );
        this.script.loadJs(app, this.js);
        this.root = null;
    }
    DoCheck(url, cookies, isFromAuto) {
        return true;
    }
    DoTraceUrl(url, args, config) {}
    //
    // ------------
    //
    isMatch(url) {
        let pattern = new RegExp(this.expr);
        return pattern.test(url);
    }
    loadJs(jsCode) {
        this.js.loadJs(jsCode);
    }
    callJs(fun, attrs) {
        return this.js.callJs(fun, attrs);
    }
    // -------------
    parse(config, url, html) {
        Log.v('parse', url);
        Log.v('parse', html == null ? 'null' : html);
        let temp = config.parse(url, html);
        if (temp == null) {
            Log.v('parse.rst', 'null' + '\r\n\n');
        } else {
            Log.v('parse.rst', temp + '\r\n\n');
        }
        return temp;
    }
    parseUrl(config, url, html) {
        Log.v('parseUrl', url);
        Log.v('parseUrl', html == null ? 'null' : html);
        let temp = config.parseUrl(url, html);
        if (temp == null) return '';
        else return temp;
    }
    //
    // ---------------------------------------
    //
    getNodeViewModel() {
        switch (arguments.length) {
            case 4: {
                let viewModel = arguments[0],
                    nodeSet = arguments[1],
                    isUpdate = arguments[2],
                    callback = arguments[3]; // home节点
                let tag = new __AsyncTag();
                let dataContext = new DataContext();
                for (let node of nodeSet.nodes()) {
                    var n = node; // 确定是SdNode类型，不用类型转换
                    this.doGetNodeViewModel2(
                        viewModel,
                        isUpdate,
                        tag,
                        n.url.value,
                        null,
                        n,
                        dataContext,
                        callback
                    );
                }
                if (tag.total == 0) {
                    callback(1);
                }
                break;
            }
            case 6: {
                if (typeof arguments[3] == 'number') {
                    let viewModel = arguments[0],
                        isUpdate = arguments[1],
                        key = arguments[2],
                        page = arguments[3],
                        config = arguments[4],
                        callback = arguments[5]; // search节点
                    try {
                        let tag = new __AsyncTag();
                        let dataContext = new DataContext();
                        this.doGetNodeViewModel1(
                            viewModel,
                            isUpdate,
                            tag,
                            config.url.value,
                            key,
                            page,
                            config,
                            dataContext,
                            callback
                        );
                    } catch (ex) {
                        callback(1);
                    }
                } else if (typeof arguments[2] == 'number') {
                    let viewModel = arguments[0],
                        isUpdate = arguments[1],
                        page = arguments[2],
                        url = arguments[3],
                        config = arguments[4],
                        callback = arguments[5]; // tag节点
                    config.url.value = url;
                    let tag = new __AsyncTag();
                    let dataContext = new DataContext();
                    this.doGetNodeViewModel1(
                        viewModel,
                        isUpdate,
                        tag,
                        url,
                        null,
                        page,
                        config,
                        dataContext,
                        callback
                    );
                } else if (
                    typeof arguments[3] == 'object' &&
                    arguments[3].constructor
                        .toString()
                        .match(/class\s+(\S+)[\s{]/)[1] == 'DdNode'
                ) {
                    let viewModel = arguments[0],
                        isUpdate = arguments[1],
                        url = arguments[2],
                        config = arguments[3],
                        args = arguments[4],
                        callback = arguments[5]; // book、section节点
                    // 需要对url进行转换成最新的格式（可能之前的旧的格式缓存）
                    try {
                        // if (this.DoCheck(url, this.cookies(), true) == false) {
                        // callback(99);
                        //     return;
                        // }nodejs版说明：暂时要注释此判断，因为有login节点的插件对login.check为0的cookie判断DoCheck('', cookies, false)为假不能保存，后面this.cookies()就为null
                        let tag = new __AsyncTag();
                        let dataContext = new DataContext();
                        this.doGetNodeViewModel2(
                            viewModel,
                            isUpdate,
                            tag,
                            url,
                            args,
                            config,
                            dataContext,
                            callback
                        );
                        if (tag.total == 0) {
                            callback(1);
                        }
                    } catch (ex) {
                        console.trace(ex);
                        callback(1);
                    }
                }
                break;
            }
            case 5: {
                let viewModel = arguments[0],
                    isUpdate = arguments[1],
                    url = arguments[2],
                    config = arguments[3],
                    callback = arguments[4]; // book、section节点
                this.getNodeViewModel(
                    viewModel,
                    isUpdate,
                    url,
                    config,
                    null,
                    callback
                );
                break;
            }
        }
    }
    doGetNodeViewModel1(
        viewModel,
        isUpdate,
        tag,
        url,
        key,
        page,
        config,
        dataContext,
        callback
    ) {
        // 适用于search/tag/subtag节点
        let msg = new HttpMessage();
        page += config.addPage; // 加上增减量
        if (key != null && TextUtils.isEmpty(config.addKey) == false) {
            // 如果有补充关键字
            key = key + ' ' + config.addKey;
        }
        msg.url = config.getUrl(url, key, page);
        if (TextUtils.isEmpty(msg.url) && config.hasAdds() == false) {
            callback(-3);
            return;
        }
        if (TextUtils.isEmpty(msg.url) == false) {
            msg.rebuild(config);
            if ('post' == config.method) {
                msg.rebuildForm(page, key);
            } else {
                msg.url = msg.url.replace(/@page/g, page + '');
                if (key != null) {
                    // 此时表示是get请求的search节点，只有它才有@key
                    msg.url = msg.url.replace(
                        /@key/g,
                        Util.urlEncode(key, config)
                    );
                }
            }
            let pageX = page;
            let keyX = key;
            msg.callback = (code, sender, text, url302) => {
                tag.value++;
                if (code == 1) {
                    if (TextUtils.isEmpty(url302)) {
                        url302 = sender.url;
                    }
                    if (TextUtils.isEmpty(config.onParseUrl) == false) {
                        // url需要解析出来(多个用;隔开)
                        // 当tag节点有parseUrl时，运行 doParseUrl_Aft 实现parse步骤直接return callback到本类的caller，否则运行 doParse_noAddin 实现parse步骤后回到本方法callback到本类的caller
                        let newUrls = [];
                        let rstUrls = this.parseUrl(config, url302, text).split(
                            ';'
                        );
                        for (let url1 of rstUrls) {
                            if (url1.length == 0) continue;
                            if (url1.startsWith(Util.NEXT_CALL)) {
                                SdApi.log(this, 'CALL::url=', url1);
                                let msg0 = new HttpMessage();
                                msg0.url = url1
                                    .replace(Util.NEXT_CALL, '')
                                    .replace('GET::', '')
                                    .replace('POST::', '');
                                msg0.rebuild(config);
                                if (url1.indexOf('POST::') > 0) {
                                    msg0.method = 'post';
                                    msg0.rebuildForm(pageX, keyX);
                                } else {
                                    msg0.method = 'get';
                                }
                                msg0.callback = msg.callback;
                                tag.total++;
                                Util.http(this, isUpdate, msg0);
                            } else {
                                newUrls.push(url1);
                            }
                        }
                        if (newUrls.length > 0) {
                            this.doParseUrl_Aft(
                                viewModel,
                                config,
                                isUpdate,
                                newUrls,
                                sender.form,
                                tag,
                                dataContext,
                                callback
                            );
                        }
                        return;
                    } else {
                        this.doParse_noAddin(viewModel, config, url302, text);
                    }
                }
                if (tag.total == tag.value) {
                    callback(code);
                }
            };
            tag.total++;
            Util.http(this, isUpdate, msg);
        }
        if (config.hasAdds()) {
            // 2.2 获取副内容（可能有多个）
            for (let n1 of config.adds()) {
                if (n1.isEmptyUrl()) continue;
                let urlA = n1.url.getValue(url);
                this.doGetNodeViewModel1(
                    viewModel,
                    isUpdate,
                    tag,
                    urlA,
                    key,
                    page,
                    n1,
                    dataContext,
                    callback
                );
            }
        }
    }

    doGetNodeViewModel2(
        viewModel,
        isUpdate,
        tag,
        url,
        args,
        config,
        dataContext,
        callback
    ) {
        // 适用于hots/updates/tags/book[1-7]/section等节点，他们的args都是null，还有book[8]，它args是开发指南说的输入框Map{ '输入框id' => '[book8]id对应输入值'}。不适用search/tag/subtag节点，
        // 需要对url进行转换成最新的格式（可能之前的旧的格式缓存）
        if (config.isEmpty()) return;
        if (config.hasItems() && TextUtils.isEmpty(config.onParse)) {
            viewModel.loadByConfig(config);
        }
        if ('@null' == config.method) {
            let url2 = config.getUrl(url, args);
            if (TextUtils.isEmpty(config.onParse)) {
                viewModel.loadByJson(config, url2);
            } else {
                viewModel.loadByJson(
                    config,
                    this.parse(config, url2, Util.toJson(args))
                );
            }
            return;
        }
        if (
            TextUtils.isEmpty(config.onParse) == false &&
            TextUtils.isEmpty(url) == false
        ) {
            // 如果没有url 和 parse，则不处理
            let msg = new HttpMessage();
            // 为doParseUrl_Aft服务(要在外围)
            // Map<Integer, String> dataList = new HashMap<>();//如果有多个地址，需要排序

            // 2.获取主内容
            msg.url = config.getUrl(url, args);
            // 有缓存的话，可能会变成同步了
            msg.rebuild(config);
            msg.rebuildForm(args);
            msg.callback = (code, sender, text, url302) => {
                tag.value++;
                if (code == 1) {
                    if (TextUtils.isEmpty(url302)) {
                        url302 = sender.url;
                    }
                    if (TextUtils.isEmpty(config.onParseUrl) == false) {
                        // 当hots/updates/tags节点有parseUrl时，运行 doParseUrl_Aft 实现parse步骤直接return callback到本类的caller，否则运行 doParse_hasAddin 实现parse步骤后回到本方法callback到本类的caller
                        // url需要解析出来(多个用;隔开)
                        let newUrls = [];
                        let rstUrls = this.parseUrl(config, url302, text).split(
                            ';'
                        );
                        for (let url1 of rstUrls) {
                            if (url1.length == 0) continue;
                            if (url1.startsWith(Util.NEXT_CALL)) {
                                SdApi.log(this, 'CALL::url=', url1);
                                let msg0 = new HttpMessage();
                                msg0.url = url1
                                    .replace(Util.NEXT_CALL, '')
                                    .replace('GET::', '')
                                    .replace('POST::', '');
                                msg0.rebuild(config);
                                if (url1.indexOf('POST::') > 0) {
                                    msg0.method = 'post';
                                    msg0.rebuildForm(args);
                                } else {
                                    msg0.method = 'get';
                                }
                                msg0.callback = msg.callback;
                                tag.total++;
                                Util.http(this, isUpdate, msg0);
                            } else {
                                newUrls.push(url1);
                            }
                        }
                        if (newUrls.length > 0) {
                            this.doParseUrl_Aft(
                                viewModel,
                                config,
                                isUpdate,
                                newUrls,
                                args,
                                tag,
                                dataContext,
                                callback
                            );
                        }
                        return; // 下面的代码被停掉
                    } else {
                        this.doParse_hasAddin(viewModel, config, url302, text);
                    }
                }
                if (tag.total == tag.value) {
                    callback(code);
                }
            };
            tag.total++;
            Util.http(this, isUpdate, msg);
        }
        if (config.hasAdds()) {
            // 2.2 获取副内容（可能有多个）
            for (let n1 of config.adds()) {
                if (n1.isEmptyUrl()) continue;
                let urlA = n1.url.getValue(url);
                this.doGetNodeViewModel2(
                    viewModel,
                    isUpdate,
                    tag,
                    urlA,
                    args,
                    n1,
                    dataContext,
                    callback
                );
            }
        }
    }

    doParseUrl_Aft(
        viewModel,
        config,
        isUpdate,
        newUrls,
        args,
        tag,
        dataContext,
        callback
    ) {
        // += newUrls.length;
        for (let newUrl2 of newUrls) {
            tag.total++;
            // tag.num --;
            let msg = new HttpMessage(config, newUrl2, tag.total, args);
            msg.callback = (code2, sender, text2, url302) => {
                tag.value++;
                if (code2 == 1) {
                    if (TextUtils.isEmpty(url302)) {
                        url302 = newUrl2;
                    }
                    this.doParse_noAddinForTmp(
                        dataContext,
                        config,
                        url302,
                        text2,
                        sender.tag
                    );
                }
                if (tag.total == tag.value) {
                    for (let cfg of dataContext.nodes()) {
                        let dataList = dataContext.get(cfg);
                        let jsonList = [];
                        for (let i = 1; i <= tag.total; i++) {
                            // 安排序加载内容
                            if (dataList.containsKey(i)) {
                                jsonList.push(dataList.get(i));
                            }
                        }
                        let strAry = jsonList;
                        viewModel.loadByJson(cfg, strAry);
                    }
                    callback(code2);
                }
            };
            Util.http(this, isUpdate, msg);
        }
    }
    doParse_noAddin(viewModel, config, url, text) {
        let json = this.parse(config, url, text);
        if (this.isDebug) {
            SdApi.log(this, config, url, json, 0);
        }
        if (json != null) {
            viewModel.loadByJson(config, json);
        }
    }
    doParse_hasAddin(viewModel, config, url, text) {
        let json = this.parse(config, url, text);
        if (this.isDebug) {
            SdApi.log(this, config, url, json, 0);
        }
        if (json != null) {
            viewModel.loadByJson(config, json);
            if (config.hasAdds()) {
                // 没有url的add
                for (let n2 of config.adds()) {
                    // 有buildUrl的sections要continue
                    if (n2.isEmptyUrl() == false) continue;
                    let json2 = this.parse(n2, url, text);
                    if (this.isDebug) {
                        SdApi.log(this, n2, url, json2, 0);
                    }
                    if (json2 != null) {
                        viewModel.loadByJson(n2, json2);
                    }
                }
            }
        }
    }
    doParse_noAddinForTmp(dataContext, config, url, text, tag) {
        let json = this.parse(config, url, text);
        if (this.isDebug) {
            SdApi.log(this, config, url, json, tag);
        }
        if (json != null) {
            dataContext.add(config, tag, json);
        }
    }
}

exports = module.exports = SdSource;
