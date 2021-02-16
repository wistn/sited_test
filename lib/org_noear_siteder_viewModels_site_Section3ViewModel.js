/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var MediaSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_MediaSdViewModel');
class Section3ViewModel extends MediaSdViewModel {
    constructor() {
        super();
        this.playIndex = 0;
        this.currentIndex = 0;
    }

    playItem() {
        return this.get(this.playIndex);
    }
    playUrl() {
        return this.get(this.playIndex).url;
    }
}
exports = module.exports = Section3ViewModel;
