/*
 * Author:wistn
 * since:2019-12-17
 * LastEditors:Do not edit
 * LastEditTime:2020-04-08
 * Description:
 */
var TagSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_TagSdViewModel');
class TagViewModel extends TagSdViewModel {
    constructor() {
        super();
        this.currentPage = 1;
    }
}
exports = module.exports = TagViewModel;
