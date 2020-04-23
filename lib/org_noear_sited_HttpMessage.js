/*
 * Author:wistn
 * since:2019-10-10
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description:
 */
var SdApi = require('./org_noear_sited_SdApi.js');
var TextUtils = require('./mytool.js').TextUtils;
var Log = require('./android_util_Log.js');
class HttpMessage {
    constructor() {
        this.header = new Map();
        this.form = new Map();
        this.url;
        this.tag;
        this.callback;
        this.config;

        // 可由cfg实始化
        this.encode;
        this.ua;
        this.method;
        switch (arguments.length) {
            case 0: {
                break;
            }
            case 4: {
                let cfg = arguments[0],
                    url = arguments[1],
                    tag = arguments[2],
                    args = arguments[3];
                this.config = cfg;
                this.url = url;
                this.tag = tag;
                if (args != null) {
                    this.form = args;
                }
                this.rebuild(null);
                break;
            }
            case 2: {
                let cfg = arguments[0],
                    url = arguments[1];

                this.config = cfg;
                this.url = url;
                this.rebuild(null);
                break;
            }
        }
    }
    rebuild(cfg) {
        if (cfg != null) {
            this.config = cfg;
        }
        this.ua = this.config.ua();
        this.encode = this.config.encode();
        this.method = this.config.method;
        SdApi.buildHttpHeader(this.config, this.url, (key, val) => {
            this.header.set(key, val);
        });
    }
    rebuildForm() {
        switch (arguments.length) {
            case 1: {
                let data = arguments[0];
                this.doBuildForm(true, 0, null, data);
                break;
            }
            case 2: {
                let page = arguments[0],
                    key = arguments[1];
                this.doBuildForm(false, page, key, null);
                break;
            }
        }
    }
    doBuildForm(isData, page, key, data) {
        if ('post' == this.config.method) {
            let _strArgs = null;
            if (isData == false) {
                _strArgs = this.config.getArgs(this.url, key, page);
            } else {
                _strArgs = this.config.getArgs(this.url, data);
            }
            if (TextUtils.isEmpty(_strArgs) == false) {
                Log.v('Post.Args', _strArgs);
                for (let kv of _strArgs.split(';')) {
                    if (kv.length > 3) {
                        let name = kv.split('=')[0];
                        let value = kv.split('=')[1];
                        if (value == '@key') this.form.set(name, key);
                        else if (value == '@page')
                            this.form.set(name, page + '');
                        else this.form.set(name, value);
                    }
                }
            }
        }
    }
}
exports = module.exports = HttpMessage;
