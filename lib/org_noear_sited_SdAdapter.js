/*
 * Author:wistn
 * since:2019-09-16
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description:
 */

class SdAdapter {
    createNode(source, tagName) {
        return new SdNode(source);
    }
    createNodeSet(source, tagName) {
        return new SdNodeSet(source);
    }
    cacheRoot() {
        return null;
    }
    log(source, tag, msg, tr) {}
    set(source, key, val) {}
    get(source, key) {
        return '';
    }
    doBuildCookie(cfg, url, header) {
        var cookies = cfg.buildCookies(url);
        if (cookies != null) {
            header('Cookie', cookies);
        }
    }
    doBuildRererer(cfg, url, header) {
        header('Referer', cfg.getReferer(url));
    }
    // header实际为callback
    buildHttpHeader(cfg, url, header) {
        if (cfg == null) return;
        if (cfg.isInCookie()) {
            this.doBuildCookie(cfg, url, header);
        }
        if (cfg.isInReferer()) {
            this.doBuildRererer(cfg, url, header);
        }
        if (cfg.isEmptyHeader() == false) {
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
exports = module.exports = SdAdapter;
var SdNode = require('./org_noear_sited_SdNode');
var SdNodeSet = require('./org_noear_sited_SdNodeSet');
// 不能先引用，不然有循环依赖
