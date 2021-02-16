/*
 * Author:wistn
 * since:2019-10-26
 * LastEditors:Do not edit
 * LastEditTime:2021-02-15
 * Description:
 */
var SdAdapter = require('./org_noear_sited_SdAdapter');
var DdNodeLogin = require('./org_noear_siteder_dao_engine_DdNodeLogin');
var DdNodeAbout = require('./org_noear_siteder_dao_engine_DdNodeAbout');
var DdNode = require('./org_noear_siteder_dao_engine_DdNode');
var DdNodeSet = require('./org_noear_siteder_dao_engine_DdNodeSet');
var LogWriter = require('./org_noear_siteder_utils_LogWriter');
var EncryptUtil = require('./me_noear_utils_EncryptUtil');
var path = require('path');
var Setting = require('./org_noear_siteder_dao_Setting');
class DdAdapter extends SdAdapter {
    // @Override
    createNode(source, tagName) {
        if ('login' == tagName) {
            return new DdNodeLogin(source);
        } else if ('reward' == tagName || 'about' == tagName) {
            return new DdNodeAbout(source);
        } else {
            return new DdNode(source);
        }
    }
    // @Override
    createNodeSet(source, tagName) {
        return new DdNodeSet(source);
    }
    //--------------------------------
    //
    constructor() {
        super();
        this._root = null;
    }
    // @Override
    cacheRoot() {
        if (this._root == null) {
            this._root = path.join(__dirname, '..');
        }
        return this._root;
    }
    //--------------------------------
    //
    // @Override
    log(source, tag, msg, tr) {
        if (msg == null) {
            msg = 'null';
        }
        if (Setting.isDeveloperModel()) {
            LogWriter.tryInit();
            LogWriter.loger.print(tag, msg, tr);
            if ('JsEngine.print' == tag) {
                // ok
                console.log(
                    '安卓版界面print消息：' +
                        (msg.length > 350
                            ? '（完整内容在sited_print.txt）' +
                              msg.slice(0, 350)
                            : msg)
                );
                LogWriter.jsprint.print(tag, msg, tr);
            }
            if (tr != null) {
                LogWriter.error.print(source.url + '::\r\n' + tag, msg, null);
            }
        }
    }
    // @Override
    get(source, key) {
        if ('g_location' == key) {
            var n = new Map();
            return n.toJson();
        }
        var newKey = EncryptUtil.md5(source.url_md5 + '::' + key);
        return DdAdapter.mSets.getString(newKey, '');
    }
    // @Override
    set(source, key, val) {
        var newKey = EncryptUtil.md5(source.url_md5 + '::' + key);
        DdAdapter.mSets.putString(newKey, val);
    }
    // @Override
    buildHttpHeader(cfg, url, header) {
        // HttpHeaderHandler header实际为callback
        if (cfg == null) return;
        if (cfg.isInCookie()) {
            this.doBuildCookie(cfg, url, header);
        }
        if (cfg.isInReferer()) {
            this.doBuildRererer(cfg, url, header);
        }
        if (cfg.isEmptyHeader() == false) {
            var s = cfg.source;
            if (s.engine < 34) {
                for (var kv of cfg.getHeader(url).split(';')) {
                    var idx = kv.indexOf('=');
                    if (idx > 0) {
                        var k = kv.substring(0, idx).trim();
                        var v = kv.substring(idx + 1).trim();
                        header(k, v);
                    } else {
                        if (kv == 'cookie') {
                            this.doBuildCookie(cfg, url, header);
                        }
                        if (kv == 'referer') {
                            this.doBuildRererer(cfg, url, header);
                        }
                    }
                }
            } else {
                for (var kv of cfg.getHeader(url).split('$$')) {
                    var idx = kv.indexOf(':');
                    if (idx > 0) {
                        var k = kv.substring(0, idx).trim();
                        var v = kv.substring(idx + 1).trim();
                        header(k, v);
                    } else {
                        if (kv == 'cookie') {
                            this.doBuildCookie(cfg, url, header);
                        }
                        if (kv == 'referer') {
                            this.doBuildRererer(cfg, url, header);
                        }
                    }
                }
            }
        }
    }
}
// static SharedPreferences mSets = App.getSettings("sited", Context.MODE_PRIVATE);
DdAdapter.mSets = new (class SharedPreferences {
    constructor() {
        this._items = new Map();
    }
    getString(key, def) {
        if (this._items.has(key)) {
            return this._items.get(key);
        } else {
            return def;
        }
    }
    putString(key, val) {
        this._items.set(key, val);
    }
})();
exports = module.exports = DdAdapter;
