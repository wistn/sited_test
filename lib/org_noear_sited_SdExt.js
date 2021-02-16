/*
 * Author:wistn
 * since:2019-10-25
 * LastEditors:Do not edit
 * LastEditTime:2020-09-25
 * Description:
 */
var SdApi = require('./org_noear_sited_SdApi');
class SdExt {
    constructor(s) {
        this.source = s;
    }
    set(key, val) {
        SdApi.set(this.source, key, val);
    }
    get(key) {
        return SdApi.get(this.source, key);
    }
}
exports = module.exports = SdExt;
