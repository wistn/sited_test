/*
 * Author:wistn
 * since:2019-09-19
 * LastEditors:Do not edit
 * LastEditTime:2021-03-02
 * Description:
 */
var Util = require('./org_noear_sited_Util');
var TextUtils = require('./mytool').TextUtils;
var SdNode = require('./org_noear_sited_SdNode');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var Log = require('./android_util_Log');
var HttpMessage = require('./org_noear_sited_HttpMessage');

class SdJscript {
    constructor(source, node) {
        this.require = null;
        this.code = null;
        this.s = source;
        if (node == null) {
            this.code = '';
            this.require = new SdNode(source).buildForNode(null);
        } else {
            this.code = Util.getElement(node, 'code').text();
            this.require = new SdNode(source).buildForNode(
                Util.getElement(node, 'require')
            );
        }
    }
    async loadJs(app, js) {
        if (this.require.isEmpty() == false) {
            for (let n1 of this.require.items()) {
                // 1.如果本地可以加载并且没有出错
                if (TextUtils.isEmpty(n1.lib) == false) {
                    if (await this.loadLib(app, js, n1.lib)) continue;
                }
                // 2.尝试网络加载
                Log.v('SdJscript', n1.url.value);
                if (n1.cache == 0) {
                    n1.cache = 1; // 长久缓存js文件 //默认长久缓存
                }
                let msg = new HttpMessage(n1, n1.url.value);
                msg.callback = (code, sender, text, url302) => {
                    if (code == 1) {
                        js.loadJs(text);
                    }
                };
                await Util.http(this.s, false, msg);
                // java版是异步请求Http，所以插件运行时第一次调用网络库失败，但后面会缓存到sited文件夹，再刷新主进程就行了因为第二次自动改为从sited文件夹缓存同步读取库代码。nodejs版也是
            }
        }
        if (TextUtils.isEmpty(this.code) == false) {
            js.loadJs(this.code);
            // 预加载插件script/code(兼容旧格式jscript/code)节点即js代码部分
        }
    }
    //---------------------
    //
    async loadLib(app, js, lib) {
        // for debug
        // Resources asset = app.getResources();
        let asset = __dirname;
        switch (lib) {
            case 'md5':
                return await SdJscript.tryLoadLibItem(asset, 'R.raw.md5', js);
            case 'sha1':
                return await SdJscript.tryLoadLibItem(asset, 'R.raw.sha1', js);
            case 'base64':
                return await SdJscript.tryLoadLibItem(
                    asset,
                    'R.raw.base64',
                    js
                );
            case 'cheerio':
                return await SdJscript.tryLoadLibItem(
                    asset,
                    'R.raw.cheerio',
                    js
                );
            default:
                return false;
        }
    }
    static async tryLoadLibItem(asset, resID, js) {
        try {
            let is = path.resolve(
                asset,
                'main_res_raw_' + resID.match(/[^.]+$/)[0] + '.js'
            );
            const read_in = readline.createInterface({
                input: fs.createReadStream(is),
                crlfDelay: Infinity
            });
            let code = await this.doToString(read_in);
            js.loadJs(code);
            return true;
        } catch (ex) {
            return false;
        }
    }
    static async doToString(read_in) {
        let buffer = [];
        for await (const line of read_in) {
            buffer.push(line, '\r\n');
        }
        // 要加换行符，不然库文件只有一行会被双斜杠注释破坏
        read_in.close();
        return buffer.join('');
    }
}
exports = module.exports = SdJscript;
