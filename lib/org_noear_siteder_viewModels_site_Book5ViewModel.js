/*
 * Author:wistn
 * since:2020-01-09
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var PicModel = require('./org_noear_siteder_models_PicModel.js');
var TextUtils = require('./mytool.js').TextUtils;
var DdSource = require('./org_noear_siteder_dao_engine_DdSource.js');
var ProductSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_ProductSdViewModel.js');
class Book5ViewModel extends ProductSdViewModel {
    constructor(s, n) {
        super(n.url);
        this.source = s;
        this.node = n;
        this.intro = '';
    }
    loadByJson(config, ...jsons) {
        // java版: (String... jsons) 表示可变长度参数列表，参数为0到多个String类型的对象，或者是一个String[]。
        if (jsons == null || jsons.length == 0) return;
        // js版: (...jsons) 表示剩余参数组成的真数组，要Array.isArray(jsons[0])识别java版的多个String或者一个String[]
        if (jsons.length == 1 && Array.isArray(jsons[0])) {
            jsons = jsons[0];
        }
        for (let json of jsons) {
            if (json.indexOf('shop') > 0 || json.indexOf('pictures') > 0) {
                this.loadByJsonData(config, json);
            } else {
                this.loadByJsonOld(config, json);
            }
        }
        //-----------------
        if (TextUtils.isEmpty(this.logo) == false) this.node.logo = this.logo;
        else this.logo = this.node.logo;
        if (TextUtils.isEmpty(this.name) == false) {
            this.node.name = this.name;
        }
    }
    loadByJsonOld(config, json) {
        let data = JSON.parse(json);
        if (DdSource.isBook(config)) {
            if (TextUtils.isEmpty(this.shop)) {
                this.logo = data.logo || '';
                this.name = data.name || '';
                this.shop = data.author || '';
                this.intro = data.intro || '';
                this.buyUrl = data.tags || '';
            }
        }
        let sl = data.sections || [];
        for (let n of sl) {
            var pic = new PicModel(this.bookUrl, n.url || '');
            this.pictures.push(pic);
        }
    }
}
exports = module.exports = Book5ViewModel;
