/*
 * Author:wistn
 * since:2019-09-13
 * LastEditors:Do not edit
 * LastEditTime:2020-04-13
 * Description:
 */

var SdSource = require('./org_noear_sited_SdSource');
var Log = require('./android_util_Log.js');
var DdApi = require('./org_noear_siteder_dao_engine_DdApi.js');
var SiteDbApi = require('./org_noear_siteder_dao_db_SiteDbApi.js');
var DdNode = require('./org_noear_siteder_dao_engine_DdNode.js');
var DdNodeSet = require('./org_noear_siteder_dao_engine_DdNodeSet.js');

var DdNodeLogin = require('./org_noear_siteder_dao_engine_DdNodeLogin.js');
var DdNodeAbout = require('./org_noear_siteder_dao_engine_DdNodeAbout.js');
var TextUtils = require('./mytool.js').TextUtils;
var HttpUtil = require('./me_noear_utils_HttpUtil.js');
var Session = require('./org_noear_siteder_dao_Session.js');
class DdSource extends SdSource {
    // 是否为私密型插件
    isPrivate() {
        return this.attrs.getInt('private') > 0;
    }
    tag(url) {
        Log.v('tag.selct::', url);
        return Object.assign(new DdNode(), this._tag.nodeMatch(url));
        // nodeMatch(url):_tag如果为SdNodeSet,返回匹配expr的tag节点SdNode否则用这个source做空白SdNode返回。_tag为SdNode时返回自己。非空白SdNode都有url属性类型是SdValue。
    }
    subtag(url) {
        Log.v('subtag.selct::', url);
        return Object.assign(new DdNode(), this._subtag.nodeMatch(url));
    }
    book(url) {
        Log.v('book.selct::', url);
        return Object.assign(new DdNode(), this._book.nodeMatch(url));
    }
    section(url) {
        Log.v('section.selct::', url);
        return Object.assign(new DdNode(), this._section.nodeMatch(url));
    }
    objectExt(url) {
        Log.v('object.selct::', url);
        return Object.assign(new DdNode(), this._objectExt.nodeMatch(url));
    }
    objectSlf(url) {
        Log.v('object.selct::', url);
        return Object.assign(new DdNode(), this._objectSlf.nodeMatch(url));
    }
    cover(url) {
        Log.v('cover.selct::', url);
        return Object.assign(new DdNode(), this._cover.nodeMatch(url));
    }
    constructor(app, xml) {
        //    public String sited;
        // sited = xml;

        super(app, xml);
        this.ver; // 版本号
        this.sds; // 插件平台服务
        this.vip; // 是否为私密型插件
        this.logo; // 图标
        this.author;
        this.contact;
        this.alert; // 提醒（打开时跳出）
        this.intro; // 介绍
        //---------------------------------------------------
        this.about;
        //---------------------------------------------------
        this.meta;
        this.main;
        this.hots;
        this.updates;
        this.search;
        this.tags;
        this.home;
        this._tag;
        this._subtag;
        this._book;
        this._section;
        this._objectSlf;
        this._objectExt;
        this._cover;
        this.login;
        this.trace_url;
        this._FullTitle;
        this._isAlerted = false;
        this.doInit(app, xml);
        if (this.schema >= 1) {
            this.xmlHeadName = 'meta';
            this.xmlBodyName = 'main';
            this.xmlScriptName = 'script';
        } else {
            this.xmlHeadName = 'meta';
            this.xmlBodyName = 'main';
            this.xmlScriptName = 'jscript';
        }
        this.doLoad(app);
        this.meta = Object.assign(new DdNodeSet(), this.head);
        this.main = Object.assign(new DdNodeSet(), this.body);

        //--------------
        this.sds = this.head.attrs.getString('sds');
        this.ver = this.head.attrs.getInt('ver');
        this.vip = this.head.attrs.getInt('vip');
        this.author = this.head.attrs.getString('author');
        this.contact = this.head.attrs.getString('contact');
        this.intro = this.head.attrs.getString('intro');
        this.logo = this.head.attrs.getString('logo');
        if (this.engine > DdApi.version()) {
            console.trace('此插件需要更高版本引擎支持，否则会出错。建议升级！');
        } else {
            if (this.head.attrs.getString('alert'))
                console.trace(this.head.attrs.getString('alert'));
        }
        //
        //---------------------
        //
        this.trace_url = this.main.attrs.getString('trace');
        this.home = Object.assign(new DdNodeSet(), this.main.get('home'));
        this.hots = Object.assign(new DdNode(), this.home.get('hots'));
        this.updates = Object.assign(new DdNode(), this.home.get('updates'));
        this.tags = Object.assign(new DdNode(), this.home.get('tags'));
        this.search = Object.assign(new DdNode(), this.main.get('search'));
        this._tag = this.main.get('tag');
        this._subtag = this.main.get('subtag');
        this._book = this.main.get('book');
        this._section = this.main.get('section');
        this._objectSlf = this.main.get('object');
        this._objectExt = this._objectSlf;
        this._cover = this.main.get('cover');
        if (this._objectExt.isEmpty()) {
            if (this._section.isEmpty()) this._objectExt = this._book;
            else this._objectExt = this._section;
        }
        if (this.schema >= 1) {
            this.login = Object.assign(
                new DdNodeLogin(),
                this.head.get('login')
            ); // 登录
            let temp = Object.assign(
                new DdNodeAbout(),
                this.head.get('reward')
            ); // 打赏
            if (temp.isEmpty()) {
                temp = Object.assign(new DdNodeAbout(), this.head.get('about')); // 打赏
            }
            this.about = temp;
        } else {
            this.login = Object.assign(
                new DdNodeLogin(),
                this.main.get('login')
            ); // 登录
            let temp = Object.assign(
                new DdNodeAbout(),
                this.main.get('reward')
            ); // 打赏
            if (temp.isEmpty()) {
                temp = Object.assign(new DdNodeAbout(), this.main.get('about')); // 打赏
            }
            this.about = temp;
        }
        //-----------
        let json = new Map();
        Session.clear(); // Session是app相关配置，本脚本没数据所以清空
        json.set('ver', DdApi.version());
        json.set('udid', Session.udid());
        json.set('uid', Session.userID);
        json.set('usex', Session.sex);
        json.set('uvip', Session.isVip);
        json.set('ulevel', Session.level);
        let jsCode =
            'SiteD=' +
            json.toJson() +
            ';SiteD.get=SdExt.get;SiteD.set=SdExt.set;';

        // this.loadJs(jsCode);
    }
    fullTitle() {
        if (this._FullTitle == null) {
            if (this.isPrivate()) {
                this._FullTitle = this.title;
            } else {
                let idx = this.url.indexOf('?');
                if (idx < 0)
                    this._FullTitle = this.title + ' (' + this.url + ')';
                else
                    this._FullTitle =
                        this.title + ' (' + this.url.substring(0, idx) + ')';
            }
        }
        return this._FullTitle;
    }
    webUrl() {
        if (TextUtils.isEmpty(this.main.durl)) return this.url;
        else return this.main.durl;
    }
    //     @Override
    setCookies(cookies) {
        if (cookies == null) return;
        Log.v('cookies', cookies);
        if (this.DoCheck('', cookies, false)) {
            super.setCookies(cookies);
            SiteDbApi.setSourceCookies(this);
        }
    }
    //     @Override
    cookies() {
        if (TextUtils.isEmpty(this._cookies)) {
            this._cookies = SiteDbApi.getSourceCookies(this);
        }
        return this._cookies;
    }
    isLoggedIn(url, cookies) {
        return this.DoCheck(url, cookies, false);
    }
    //     @Override
    DoCheck(url, cookies, isFromAuto) {
        if (this.login.isEmpty()) {
            return true;
        } else {
            return this.login.doCheck(url, cookies, isFromAuto);
        }
    }
    //     @Override
    DoTraceUrl(url, args, config) {
        if (TextUtils.isEmpty(this.trace_url) == false) {
            if (TextUtils.isEmpty(this.url) == false) {
                try {
                    let data = new Map();
                    Session.clear(); // Session是app相关配置，本脚本没数据所以清空
                    data.set('_uid', Session.userID + '');
                    data.set('_uname', Session.nickname);
                    data.set('_days', Session.dayNum + '');
                    data.set('_vip', Session.isVip + '');
                    data.set('url', url);
                    data.set('args', args);
                    data.set('node', config.name);
                    HttpUtil.post(this.trace_url, data, (code, text) => {});
                } catch (ex) {
                    console.trace(ex);
                }
            }
        }
    }
    static isHots(node) {
        return 'hots' == node.name;
    }
    static isUpdates(node) {
        return 'updates' == node.name;
    }
    static isTags(node) {
        return 'tags' == node.name;
    }
    static isBook(node) {
        return 'book' == node.name;
    }
    //
    //--------------------------
    //
    tryAlert(activity, callback) {
        if (TextUtils.isEmpty(this.alert)) return false;
        else {
            if (this._isAlerted == false) {
            }
            return true;
        }
    }
    tryAbout(from) {}
    tryLogin(activity, forUser) {
        if (this.login.isEmpty()) return;
        if (this.login.isWebrun()) {
            let loginUrl = this.login.getUrl(this.login.url.value);
            // Navigation.showWebAddinLogin(activity, this, loginUrl);//界面配置脚本不加载
        } else {
        }
    }
}
exports = module.exports = DdSource;
