/*
 * Author:wistn
 * since:2019-09-13
 * LastEditors:Do not edit
 * LastEditTime:2021-02-17
 * Description:
 */

var SdSource = require('./org_noear_sited_SdSource');
var Log = require('./android_util_Log');
var DdApi = require('./org_noear_siteder_dao_engine_DdApi');
var SiteDbApi = require('./org_noear_siteder_dao_db_SiteDbApi');
var TextUtils = require('./mytool').TextUtils;
var HttpUtil = require('./me_noear_utils_HttpUtil');
var Session = require('./org_noear_siteder_dao_Session');
class DdSource extends SdSource {
    // 是否为私密型插件
    isPrivate() {
        return this.attrs.getInt('private') > 0;
    }
    tag(url) {
        Log.v('tag.selct::', url);
        return this._tag.nodeMatch(url);
        // nodeMatch(url):_tag如果为SdNodeSet/DdNodeSet,返回匹配expr的tag节点SdNode/DdNode否则用这个source做空白SdNode/DdNode返回。_tag为SdNode/DdNode时返回自己。非空白SdNode/DdNode都有url属性(类型是SdValue)。下同
    }
    subtag(url) {
        Log.v('subtag.selct::', url);
        return this._subtag.nodeMatch(url);
    }
    book(url) {
        Log.v('book.selct::', url);
        return this._book.nodeMatch(url);
    }
    section(url) {
        Log.v('section.selct::', url);
        return this._section.nodeMatch(url);
    }
    objectExt(url) {
        Log.v('object.selct::', url);
        return this._objectExt.nodeMatch(url);
    }
    objectSlf(url) {
        Log.v('object.selct::', url);
        return this._objectSlf.nodeMatch(url);
    }
    cover(url) {
        Log.v('cover.selct::', url);
        return this._cover.nodeMatch(url);
    }
    constructor(app, xml) {
        //    public String sited;
        // sited = xml;
        super(app, xml);
        return (async () => {
            var asyncInstance = await this;
            asyncInstance.ver = 0; // 版本号
            asyncInstance.sds = null; // 插件平台服务
            asyncInstance.vip = 0; // 是否为私密型插件
            asyncInstance.logo = null; // 图标
            asyncInstance.author = null;
            asyncInstance.contact = null;
            asyncInstance.alert = null; // 提醒（打开时跳出）
            asyncInstance.intro = null; // 介绍
            //---------------------------------------------------
            asyncInstance.about = null;
            //---------------------------------------------------
            asyncInstance.meta = null;
            asyncInstance.main = null;
            asyncInstance.hots = null;
            asyncInstance.updates = null;
            asyncInstance.search = null;
            asyncInstance.tags = null;
            asyncInstance.home = null;
            asyncInstance._tag = null;
            asyncInstance._subtag = null;
            asyncInstance._book = null;
            asyncInstance._section = null;
            asyncInstance._objectSlf = null;
            asyncInstance._objectExt = null;
            asyncInstance._cover = null;
            asyncInstance.login = null;
            asyncInstance.trace_url = null;
            asyncInstance._FullTitle = null;
            asyncInstance._isAlerted = false;
            asyncInstance.doInit(app, xml);
            if (asyncInstance.schema >= 1) {
                asyncInstance.xmlHeadName = 'meta';
                asyncInstance.xmlBodyName = 'main';
                asyncInstance.xmlScriptName = 'script';
            } else {
                asyncInstance.xmlHeadName = 'meta';
                asyncInstance.xmlBodyName = 'main';
                asyncInstance.xmlScriptName = 'jscript';
            }
            await asyncInstance.doLoad(app);
            asyncInstance.meta = asyncInstance.head;
            asyncInstance.main = asyncInstance.body;

            //--------------
            asyncInstance.sds = asyncInstance.head.attrs.getString('sds');
            asyncInstance.ver = asyncInstance.head.attrs.getInt('ver');
            asyncInstance.vip = asyncInstance.head.attrs.getInt('vip');
            asyncInstance.author = asyncInstance.head.attrs.getString('author');
            asyncInstance.contact = asyncInstance.head.attrs.getString(
                'contact'
            );
            asyncInstance.intro = asyncInstance.head.attrs.getString('intro');
            asyncInstance.logo = asyncInstance.head.attrs.getString('logo');
            if (asyncInstance.engine > DdApi.version()) {
                asyncInstance.alert =
                    '此插件需要更高版本引擎支持，否则会出错。建议升级！';
                console.log(asyncInstance.alert);
            } else {
                asyncInstance.alert = asyncInstance.head.attrs.getString(
                    'alert'
                );
                if (asyncInstance.alert)
                    console.log('alert节点消息：' + asyncInstance.alert);
            }
            //
            //---------------------
            //
            asyncInstance.trace_url = asyncInstance.main.attrs.getString(
                'trace'
            );
            asyncInstance.home = asyncInstance.main.get('home');
            asyncInstance.hots = asyncInstance.home.get('hots');
            asyncInstance.updates = asyncInstance.home.get('updates');
            asyncInstance.tags = asyncInstance.home.get('tags');
            asyncInstance.search = asyncInstance.main.get('search');
            asyncInstance._tag = asyncInstance.main.get('tag');
            asyncInstance._subtag = asyncInstance.main.get('subtag');
            asyncInstance._book = asyncInstance.main.get('book');
            asyncInstance._section = asyncInstance.main.get('section');
            asyncInstance._objectSlf = asyncInstance.main.get('object');
            asyncInstance._objectExt = asyncInstance._objectSlf;
            asyncInstance._cover = asyncInstance.main.get('cover');
            if (asyncInstance._objectExt.isEmpty()) {
                if (asyncInstance._section.isEmpty())
                    asyncInstance._objectExt = asyncInstance._book;
                else asyncInstance._objectExt = asyncInstance._section;
            }
            if (asyncInstance.schema >= 1) {
                asyncInstance.login = asyncInstance.head.get('login'); // 登录
                let temp = asyncInstance.head.get('reward'); // 打赏
                if (temp.isEmpty()) {
                    temp = asyncInstance.head.get('about'); // 打赏
                }
                asyncInstance.about = temp;
            } else {
                asyncInstance.login = asyncInstance.main.get('login'); // 登录
                let temp = asyncInstance.main.get('reward'); // 打赏
                if (temp.isEmpty()) {
                    temp = asyncInstance.main.get('about'); // 打赏
                }
                asyncInstance.about = temp;
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
            asyncInstance.loadJs(jsCode);
            return asyncInstance;
        })();
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
    async DoTraceUrl(url, args, config) {
        if (TextUtils.isEmpty(this.trace_url) == false) {
            if (TextUtils.isEmpty(url) == false) {
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
                    await HttpUtil.post(
                        this.trace_url,
                        data,
                        (code, text) => {}
                    );
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
