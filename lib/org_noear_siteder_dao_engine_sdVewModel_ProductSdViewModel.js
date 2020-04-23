/*
 * Author:wistn
 * since:2020-01-09
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var PicModel = require('./org_noear_siteder_models_PicModel.js');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase.js');
var DdSource = require('./org_noear_siteder_dao_engine_DdSource.js');
var TextUtils = require('./mytool.js').TextUtils;
class ProductSdViewModel extends ViewModelBase {
    constructor(url) {
        super();
        this.pictures = [];
        this.logo;
        this.name;
        this.shop;
        this.intro;
        this.buyUrl;
        this.bookUrl = url;
    }
    // @Override
    loadByConfig(config) {}
    // @Override
    loadByJson(config, ...jsons) {
        // java版: (String... jsons) 表示可变长度参数列表，参数为0到多个String类型的对象，或者是一个String[]。
        if (jsons == null || jsons.length == 0) return;
        // js版: (...jsons) 表示剩余参数组成的真数组，要Array.isArray(jsons[0])识别java版的多个String或者一个String[]
        if (jsons.length == 1 && Array.isArray(jsons[0])) {
            jsons = jsons[0];
        }
        for (let json of jsons) {
            this.loadByJsonData(config, json);
        }
    }
    loadByJsonData(config, json) {
        let data = JSON.parse(json);
        if (DdSource.isBook(config)) {
            if (TextUtils.isEmpty(this.shop)) {
                this.logo = data.logo || '';
                this.name = data.name || '';
                this.shop = data.shop || '';
                this.intro = data.intro || '';
                this.buyUrl = data.buyUrl || '';
            }
        }
        let sl = data.pictures || [];
        for (let n of sl) {
            var pic = new PicModel(this.bookUrl, n || '');
            this.pictures.push(pic);
        }
    }
    //--------------
    clear() {
        this.pictures = [];
    }
    total() {
        return this.pictures.length;
    }
    get(index) {
        return this.pictures[index];
    }
}
exports = module.exports = ProductSdViewModel;
