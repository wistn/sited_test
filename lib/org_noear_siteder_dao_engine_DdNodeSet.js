/*
 * Author:wistn
 * since:2019-10-26
 * LastEditors:Do not edit
 * LastEditTime:2020-05-18
 * Description:
 */
var SdNodeSet = require('./org_noear_sited_SdNodeSet');
var TextUtils = require('./mytool').TextUtils;

class DdNodeSet extends SdNodeSet {
    s() {
        return this.source;
    }
    constructor(source) {
        super(source);
        this.btag = null;
        this.durl = null; // 数据url（url是给外面看的；durl是真实的地址）
        this.showWeb = false;
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
