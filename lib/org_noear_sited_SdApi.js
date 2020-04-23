/*
 * Author:wistn
 * since:2019-09-16
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description:
 */

class SdApi {
    static tryInit(adapter) {
        SdApi._adapter = adapter;
    }
    // -------------------------------
    //
    static log() {
        switch (arguments.length) {
            case 5: {
                let source = arguments[0],
                    node = arguments[1],
                    url = arguments[2],
                    json = arguments[3],
                    tag = arguments[4];
                this.log(source, node.name, 'tag=' + tag);
                if (url == null) {
                    this.log(source, node.name, 'url=null');
                } else {
                    this.log(source, node.name, url);
                }
                if (json == null) {
                    this.log(source, node.name, 'json=null');
                } else {
                    this.log(source, node.name, json);
                }
                break;
            }
            case 3: {
                if (arguments[2] == null || typeof arguments[2] == 'string') {
                    let source = arguments[0],
                        tag = arguments[1],
                        msg = arguments[2];
                    if (msg == null) {
                        msg = 'null';
                    }
                    try {
                        Log.v(tag, msg);
                        this._adapter.log(source, tag, msg, null);
                    } catch (ex) {
                        console.trace(ex);
                    }
                    break;
                } else if (arguments[2] instanceof Error) {
                    // java实参有声明类型让函数重载时检测，但js无，但arguments[2]一定不为null因为try后面的catch(error)里才调用本函数
                    let source = arguments[0],
                        tag = arguments[1],
                        tr = arguments[2];
                    try {
                        var msg = tr.message;
                        if (msg == null) {
                            msg = 'null';
                        }
                        Log.v(tag, msg);
                        this._adapter.log(source, tag, msg, tr);
                    } catch (ex) {
                        console.trace(ex);
                    }
                    break;
                }
            }
        }
    }
    static set(source, key, val) {
        Log.v('SiteD.set:', key + '=' + val);
        this._adapter.set(source, key, val);
    }
    static get(source, key) {
        var temp = this._adapter.get(source, key);
        Log.v('SiteD.get:', key + '=' + temp);
        return temp;
    }
    // -------------
    //
    static cacheRoot() {
        return SdApi._adapter.cacheRoot();
    }
    // -------------
    //
    static createNode(source, tagName) {
        return this._adapter.createNode(source, tagName);
    }
    static createNodeSet(source, tagName) {
        return this._adapter.createNodeSet(source, tagName);
    }
    static buildHttpHeader(cfg, url, header) {
        this._adapter.buildHttpHeader(cfg, url, header);
    }
}

exports = module.exports = SdApi;
var Log = require('./android_util_Log.js');
var SdAdapter = require('./org_noear_sited_SdAdapter.js'); // 不能先引用，不然有循环依赖
SdApi._adapter = new SdAdapter();
