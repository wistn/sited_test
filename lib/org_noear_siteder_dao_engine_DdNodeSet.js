/*
 * Author:wistn
 * since:2019-10-26
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var SdNodeSet = require('./org_noear_sited_SdNodeSet.js');
var TextUtils = require('./mytool.js').TextUtils;
class DdNodeSet extends SdNodeSet {
    s() {
        return this.source;
    }
    constructor(source) {
        super(source);
        this.btag;
        this.durl; // 数据url（url是给外面看的；durl是真实的地址）
        this.showWeb;
    }
    // @Override
    OnDidInit() {
        this.showWeb =
            this.attrs.getInt('showWeb', this.s().isPrivate() ? 0 : 1) > 0;
        this.durl = this.attrs.getString('durl', this.source.url);
        this.btag = this.attrs.getString('btag');
        if (TextUtils.isEmpty(this.btag)) {
            // 对旧格式的兼容
            this.btag = this.attrs.getString('dtag');
        }
    }
}
exports = module.exports = DdNodeSet;
