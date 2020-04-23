/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2020-04-08
 * Description:
 */
var MediaSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_MediaSdViewModel.js');
class Section3ViewModel extends MediaSdViewModel {
    constructor() {
        super();
        this.playIndex = 0;
        this.currentIndex;
    }

    playItem() {
        return this.get(this.playIndex);
    }
    playUrl() {
        return this.get(this.playIndex).url;
    }
}
exports = module.exports = Section3ViewModel;
