/*
 * Author:wistn
 * since:2020-01-04
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var TxtModel = require('./org_noear_siteder_models_TxtModel.js');
var TextSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_TextSdViewModel.js');
var TextUtils = require('./mytool.js').TextUtils;

class Book6ViewModel extends TextSdViewModel {
    addTitleItem(d, isB) {
        let txt = new TxtModel(this.referer, d, 1, isB);
        this.items.push(txt);
    }
    constructor(s, n) {
        super(n.url);
        this.source = s;
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
exports = module.exports = Book6ViewModel;
