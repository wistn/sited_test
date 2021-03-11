/*
 * Author:wistn
 * since:2020-01-09
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
var PicModel = require('./org_noear_siteder_models_PicModel');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase');
var DdSource = require('./org_noear_siteder_dao_engine_DdSource');
var TextUtils = require('./mytool').TextUtils;
var ONode = require('./noear_snacks_ONode');
class ProductSdViewModel extends ViewModelBase {
    constructor(url) {
        super();
        this.pictures = [];
        this.logo = null;
        this.name = null;
        this.shop = null;
        this.intro = null;
        this.buyUrl = null;
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
        let data = ONode.tryLoad(json);
        if (DdSource.isBook(config)) {
            if (TextUtils.isEmpty(this.shop)) {
                this.logo = data.get('logo').getString();
                this.name = data.get('name').getString();
                this.shop = data.get('shop').getString();
                this.intro = data.get('intro').getString();
                this.buyUrl = data.get('buyUrl').getString();
            }
        }
        let sl = data.get('pictures').asArray();
        for (let n of sl) {
            var pic = new PicModel(this.bookUrl, n.getString());
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
