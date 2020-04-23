/*
 * Author:wistn
 * since:2020-01-04
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var TxtModel = require('./org_noear_siteder_models_TxtModel.js');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase.js');
var TextUtils = require('./mytool.js').TextUtils;
class TextSdViewModel extends ViewModelBase {
    constructor(referer) {
        super();
        this.items = [];
        this.referer = referer;
        // 从网页过来时，需要name,logo
        this.name;
        this.logo;
    }
    clear() {
        this.items = [];
    }
    total() {
        return this.items.length;
    }
    get(index) {
        if (index >= 0 && index < this.total()) {
            return this.items[index];
        } else {
            return null;
        }
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
        let list = null;
        let obj = JSON.parse(json);
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            list = obj.list || [];
            if (TextUtils.isEmpty(this.name)) {
                this.name = obj.name || '';
                this.logo = obj.logo || '';
            }
        } else {
            list = obj;
        }
        var idx = 0; // 一段段的插入开头
        for (let n of list) {
            var txt = new TxtModel(
                this.referer,
                n.d || '',
                n.t || 0,
                n.c || '',
                (n.b || 0) > 0,
                (n.i || 0) > 0,
                (n.u || 0) > 0,
                n.w || 0,
                n.h || 0,
                n.url || '',
                (n.ss || 0) > 0
            );
            if (config.update == 2) {
                this.items.splice(idx, 0, txt);
                idx++;
            } else {
                this.items.push(txt);
            }
        }
    }
}
exports = module.exports = TextSdViewModel;
