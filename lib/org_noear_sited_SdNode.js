/*
 * Author:wistn
 * since:2019-09-12
 * LastEditors:Do not edit
 * LastEditTime:2020-04-18
 * Description:
 */

class SdNode {
    constructor(source) {
        this.source = source;
        this._dtype;
        this._btype;
        this.attrs = new SdAttributeList();
        this.name; // 节点名称
        this.key; // 自定义关键字
        this.title; // 标题
        this.txt; // txt//一用于item
        this.logo; // logo
        this.expr;
        this.group;
        this.lib;
        this.btn;
        this.update;
        // 可动态构建
        this.url; // url
        this.args;
        this.referer;
        this.cookie;
        this.header; // http header 头需求: cookies|accept
        this.method; // http method
        this._encode; // http 编码
        this._ua; // http ua
        this.cache = 1; // 单位为秒(0不缓存；1不限时间)
        // parse
        this.onParse; // 解析函数
        this.onParseUrl; // 解析出真正在请求的Url
        // build
        // protected String buildArgs;
        // protected String buildUrl;
        // protected String buildReferer;
        // protected String buildHeader;
        // add prop for search or tag
        this.addCookie; // 需要添加的cookie
        this.addKey; // 需要添加的关键字
        this.addPage; // 需要添加的页数值
        // ext prop (for post)
        this._isEmpty;
        this._items;
        this._adds;
    }
    OnDidInit() {}
    dtype() {
        if (this._dtype > 0) return this._dtype;
        else {
            return this.source.body.dtype();
        }
    }
    btype() {
        if (this._btype > 0) return this._btype;
        else return this.dtype();
    }
    nodeType() {
        return 1;
    }
    nodeName() {
        return this.name;
    }
    nodeMatch(url) {
        return this;
    }
    // @Override
    isEmpty() {
        return this._isEmpty;
    }
    items() {
        return this._items;
    }
    adds() {
        return this._adds;
    }
    // 是否有宏定义@key,@page
    hasMacro() {
        if (this.url == null || this.url.indexOf('@') < 0) return false;
        else return true;
    }
    // 是否有分页
    hasPaging() {
        return (
            this.hasMacro() ||
            this.url.isEmptyBuild() == false ||
            'post' == this.method
        );
    }
    isMatch(url) {
        if (TextUtils.isEmpty(this.expr) == false) {
            let pattern = new RegExp(this.expr);
            return pattern.test(url);
        } else {
            return false;
        }
    }

    isEquals(node) {
        if (this.name == null) return false;
        return this.name == node.name;
    }
    isInCookie() {
        if (this.header == null) return false;
        else return this.header.indexOf('cookie') >= 0;
    }
    isInReferer() {
        if (this.header == null) return false;
        else return this.header.indexOf('referer') >= 0;
    }
    hasItems() {
        if (this._items == null || this._items.length == 0) return false;
        else return true;
    }
    hasAdds() {
        if (this._adds == null || this._adds.length == 0) return false;
        else return true;
    }
    ua() {
        if (TextUtils.isEmpty(this._ua)) return this.source.ua();
        else return this._ua;
    }
    encode() {
        if (TextUtils.isEmpty(this._encode)) return this.source.encode();
        else return this._encode;
    }
    // 获取cookies
    buildCookies(url) {
        var cookies = this.source.cookies();
        var attrs = new SdAttributeList();
        attrs.set('url', url);
        attrs.set('cookies', cookies == null ? '' : cookies);
        cookies = this.cookie.run(this.source, attrs, cookies); // sdvalue的run方法
        if (TextUtils.isEmpty(this.addCookie) == false) {
            if (TextUtils.isEmpty(cookies)) {
                cookies =
                    this.addCookie +
                    '; Path=/; Domain=' +
                    url.match(/\/\/([^/:]+)/)[1]; // hostname
            } else {
                cookies = this.addCookie + '; ' + cookies;
            }
        }
        if (cookies == null) {
            Log.i('cookies', 'null');
        } else {
            Log.i('cookies', cookies);
        }
        return cookies;
    }
    buildForNode(cfg) {
        this._isEmpty = cfg == null;
        if (this._isEmpty == false) {
            cfg = cfg.nodeType ? cfg : cfg[0]; // 把cheerio(元素名)变为cheerio(元素名)[0]，不像java做Node Element转换
            this.name = cfg.tagName; // 默认为标签名
            var nnMap = new Map(Object.entries(cfg.attribs)); // cheerio(元素名).attr()即cheerio(元素名)[0].attribs返回没有长度的对象或者{}
            for (let [key, value] of nnMap) {
                this.attrs.set(key, value);
            }
            this._dtype = this.attrs.getInt('dtype');
            this._btype = this.attrs.getInt('btype');
            this.key = this.attrs.getString('key');
            this.title = this.attrs.getString('title');
            this.method = this.attrs.getString('method', 'get');
            this.onParse = this.attrs.getString2('onParse', 'parse');
            this.onParseUrl = this.attrs.getString2('onParseUrl', 'parseUrl');
            this.txt = this.attrs.getString('txt'); //
            this.lib = this.attrs.getString('lib');
            this.btn = this.attrs.getString('btn');
            this.expr = this.attrs.getString('expr');
            this.update = this.attrs.getInt('update', 0);
            this._encode = this.attrs.getString('encode');
            this._ua = this.attrs.getString('ua');
            // book,section 特有
            this.addCookie = this.attrs.getString('addCookie');
            this.addKey = this.attrs.getString('addKey');
            this.addPage = this.attrs.getInt('addPage');
            this.buildDynamicProps();
            {
                let temp = this.attrs.getString('cache');
                if (TextUtils.isEmpty(temp) == false) {
                    let len = temp.length;
                    if (len == 1) {
                        this.cache = Number(temp);
                    } else if (len > 1) {
                        this.cache = Number(temp.substring(0, len - 1));
                        let p = temp.substring(len - 1);
                        switch (p) {
                            case 'd':
                                this.cache = this.cache * 24 * 60 * 60;
                                break;
                            case 'h':
                                this.cache = this.cache * 60 * 60;
                                break;
                            case 'm':
                                this.cache = this.cache * 60;
                                break;
                        }
                    }
                }
            }
            if (cfg.children) {
                this._items = [];
                this._adds = [];
                let list = cfg.children;
                for (let i = 0, len = list.length; i < len; i++) {
                    let n1 = list[i];
                    if (n1.nodeType == 1) {
                        let e1 = n1;
                        let tagName = e1.tagName;
                        if (tagName == 'item') {
                            let temp = SdApi.createNode(
                                this.source,
                                tagName
                            ).buildForItem(e1, this);
                            this._items.push(temp);
                        } else if (Object.keys(e1.attribs).length) {
                            let temp = SdApi.createNode(
                                this.source,
                                tagName
                            ).buildForAdd(e1, this);
                            this._adds.push(temp);
                        } else {
                            this.attrs.set(e1.tagName, e1.text());
                        }
                    }
                }
            }
        }
        this.OnDidInit();
        return this;
    }
    // item(不继承父节点)
    buildForItem(cfg, p) {
        cfg = cfg.nodeType ? cfg : cfg[0]; // 把cheerio(元素名)变为cheerio(元素名)[0]
        var nnMap = new Map(Object.entries(cfg.attribs));
        for (let [key, value] of nnMap) {
            this.attrs.set(key, value);
        }
        this.name = p.name;
        this.url = this.attrs.getValue('url'); //
        this.key = this.attrs.getString('key');
        this.title = this.attrs.getString('title'); // 可能为null
        this.group = this.attrs.getString('group');
        this.txt = this.attrs.getString('txt'); //
        this.lib = this.attrs.getString('lib');
        this.btn = this.attrs.getString('btn');
        this.expr = this.attrs.getString('expr');
        this.logo = this.attrs.getString('logo');
        this._encode = this.attrs.getString('encode');
        return this;
    }
    // add (不继承父节点)
    buildForAdd(cfg, p) {
        // add不能有自己独立的url //定义为同一个page的数据获取(可能需要多个ajax)
        cfg = cfg.nodeType ? cfg : cfg[0]; // 把cheerio(元素名)变为cheerio(元素名)[0]
        var nnMap = new Map(Object.entries(cfg.attribs));
        for (let [key, value] of nnMap) {
            this.attrs.set(key, value);
        }
        this._dtype = this.attrs.getInt('dtype');
        this._btype = this.attrs.getInt('btype');
        this.name = cfg.tagName; // 默认为标签名
        this.title = this.attrs.getString('title');
        // 可能为null
        this.key = this.attrs.getString('key');
        this.btn = this.attrs.getString('btn');
        this.txt = this.attrs.getString('txt'); //
        this.method = this.attrs.getString('method');
        this._encode = this.attrs.getString('encode');
        this._ua = this.attrs.getString('ua');
        this.buildDynamicProps();
        //--------
        this.onParse = this.attrs.getString2('onParse', 'parse');
        this.onParseUrl = this.attrs.getString2('onParseUrl', 'parseUrl');
        {
            let temp = this.attrs.getString('cache'); // 增加适配多search节点搜索的cache
            if (TextUtils.isEmpty(temp) == false) {
                let len = temp.length;
                if (len == 1) {
                    this.cache = Number(temp);
                } else if (len > 1) {
                    this.cache = Number(temp.substring(0, len - 1));
                    let pp = temp.substring(len - 1);
                    switch (pp) {
                        case 'd':
                            this.cache = this.cache * 24 * 60 * 60;
                            break;
                        case 'h':
                            this.cache = this.cache * 60 * 60;
                            break;
                        case 'm':
                            this.cache = this.cache * 60;
                            break;
                    }
                }
            }
        }
        return this;
    }
    buildDynamicProps() {
        this.url = this.attrs.getValue('url');
        this.args = this.attrs.getValue('args');
        this.header = this.attrs.getValue('header', '');
        this.referer = this.attrs.getValue('referer');
        this.cookie = this.attrs.getValue('cookie');
        if (this.source.schema < 2) {
            this.url.build = this.attrs.getString('buildUrl');
            this.args.build = this.attrs.getString('buildArgs');
            this.header.build = this.attrs.getString('buildHeader');
            this.referer.build = this.attrs.getString2(
                'buildReferer',
                'buildRef'
            );
            this.cookie.build = this.attrs.getString('buildCookie');
        }
    }
    //
    //=======================================
    //

    getArgs() {
        switch (arguments.length) {
            case 3: {
                let url = arguments[0],
                    key = arguments[1],
                    page = arguments[2];
                let atts = new SdAttributeList();
                atts.set('url', url);
                if (key != null) {
                    atts.set('key', key);
                }
                atts.set('page', page + '');
                return this.args.run(this.source, atts);
            }
            case 2: {
                let url = arguments[0],
                    data = arguments[1];
                let atts = new SdAttributeList();
                atts.set('url', url);
                if (data != null) {
                    atts.set('data', Util.toJson(data));
                }
                return this.args.run(this.source, atts);
            }
        }
    }
    getUrl() {
        switch (arguments.length) {
            case 0: {
                let atts = new SdAttributeList();
                return this.url.run(this.source, atts);
            }
            case 1: {
                let url = arguments[0];
                let atts = new SdAttributeList();
                atts.set('url', url);
                return this.url.run(this.source, atts, url);
            }
            case 3: {
                let url = arguments[0],
                    key = arguments[1],
                    page = arguments[2];
                let atts = new SdAttributeList();
                atts.set('url', url);
                if (key != null) {
                    atts.set('key', key);
                }
                atts.set('page', page + '');
                return this.url.run(this.source, atts, url);
            }
            case 2: {
                let url = arguments[0],
                    data = arguments[1];
                let atts = new SdAttributeList();
                atts.set('url', url);
                if (data != null) {
                    atts.set('data', Util.toJson(data));
                }
                return this.url.run(this.source, atts, url);
            }
        }
    }

    getReferer(url) {
        let atts = new SdAttributeList();
        atts.set('url', url);
        return this.referer.run(this.source, atts, url);
    }
    getHeader(url) {
        let atts = new SdAttributeList();
        atts.set('url', url);
        return this.header.run(this.source, atts);
    }
    getFullHeader(url) {
        let list = new Map();
        SdApi.buildHttpHeader(this, url, (key, val) => {
            list.set(key, val);
        });
        return list;
    }
    parse(url, html) {
        if (TextUtils.isEmpty(this.onParse)) {
            return html;
        }
        if ('@null' == this.onParse)
            // 如果是@null，说明不需要通过js解析
            return html;
        else {
            let atts = new SdAttributeList();
            atts.set('url', url);
            atts.set('html', html);
            return this.source.js.callJs(this.onParse, atts);
        }
    }
    parseUrl(url, html) {
        let atts = new SdAttributeList();
        atts.set('url', url);
        atts.set('html', html);
        let temp = this.source.js.callJs(this.onParseUrl, atts);
        if (temp == null) return '';
        else return temp;
    }
    isEmptyUrl() {
        return this.url == null || this.url.isEmpty();
    }
    isEmptyHeader() {
        return this.header == null || this.header.isEmpty();
    }
}

exports = module.exports = SdNode;
var SdAttributeList = require('./org_noear_sited_SdAttributeList');
var TextUtils = require('./mytool').TextUtils;
var SdApi = require('./org_noear_sited_SdApi');
var Util = require('./org_noear_sited_Util.js');
var Log = require('./android_util_Log.js');
