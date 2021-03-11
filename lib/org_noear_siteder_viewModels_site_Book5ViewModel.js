/*
 * Author:wistn
 * since:2020-01-09
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
var PicModel = require('./org_noear_siteder_models_PicModel');
var TextUtils = require('./mytool').TextUtils;
var DdSource = require('./org_noear_siteder_dao_engine_DdSource');
var ProductSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_ProductSdViewModel');
var ONode = require('./noear_snacks_ONode');
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
        let data = ONode.tryLoad(json);
        if (DdSource.isBook(config)) {
            if (TextUtils.isEmpty(this.shop)) {
                this.logo = data.get('logo').getString();
                this.name = data.get('name').getString();
                this.shop = data.get('author').getString();
                this.intro = data.get('intro').getString();
                this.buyUrl = data.get('tags').getString();
            }
        }
        let sl = data.get('sections').asArray();
        for (let n of sl) {
            var pic = new PicModel(this.bookUrl, n.get('url').getString());
            this.pictures.push(pic);
        }
    }
}
exports = module.exports = Book5ViewModel;
