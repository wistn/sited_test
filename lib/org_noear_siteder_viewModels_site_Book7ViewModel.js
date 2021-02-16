/*
 * Author:wistn
 * since:2020-01-03
 * LastEditors:Do not edit
 * LastEditTime:2021-01-21
 * Description:
 */
var MediaSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_MediaSdViewModel');
var TextUtils = require('./mytool').TextUtils;
class Book7ViewModel extends MediaSdViewModel {
    playItem() {
        return this.get(this.playIndex);
    }
    playUrl() {
        return this.get(this.playIndex).url;
    }
    // public final DdSource source;
    constructor(n) {
        super();
        this.playIndex = 0;
        this.currentIndex = 0;
        this.node = n;
    }
    // @Override
    loadByJson(config, ...jsons) {
        super.loadByJson(config, ...jsons);
        //-----------
        if (TextUtils.isEmpty(this.logo) == false) this.node.logo = this.logo;
        else {
            if (TextUtils.isEmpty(this.logo)) {
                this.logo = this.node.logo;
            }
        }
        if (TextUtils.isEmpty(this.name) == false) {
            this.node.name = this.name;
        } else {
            if (TextUtils.isEmpty(this.name)) {
                this.name = this.node.name;
            }
        }
    }
}
exports = module.exports = Book7ViewModel;
