/*
 * Author:wistn
 * since:2020-01-04
 * LastEditors:Do not edit
 * LastEditTime:2021-01-21
 * Description:
 */
var TxtModel = require('./org_noear_siteder_models_TxtModel');
var TextSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_TextSdViewModel');
class Section2ViewModel extends TextSdViewModel {
    addTitleItem(d, isB) {
        let txt = new TxtModel(this.referer, d, 1, isB);
        this.items.push(txt);
    }

    addToolItem() {
        let txt = new TxtModel(this.referer, '', 99, false);
        this.items.push(txt);
    }

    constructor(section) {
        // 参数类型是SectionModel
        super(section.url);
        this.currentIndex = 0;
        this.section = section;
    }
}
exports = module.exports = Section2ViewModel;
