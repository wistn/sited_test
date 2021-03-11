/*
 * Author:wistn
 * since:2020-01-04
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
var TxtModel = require('./org_noear_siteder_models_TxtModel');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase');
var TextUtils = require('./mytool').TextUtils;
var ONode = require('./noear_snacks_ONode');
class TextSdViewModel extends ViewModelBase {
    constructor(referer) {
        super();
        this.items = [];
        // 从网页过来时，需要name,logo
        this.name = null;
        this.logo = null;
        this.referer = referer;
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
        let obj = ONode.tryLoad(json);
        if (obj.isObject()) {
            list = obj.get('list').asArray();
            if (TextUtils.isEmpty(this.name)) {
                this.name = obj.get('name').getString();
                this.logo = obj.get('logo').getString();
            }
        } else {
            list = obj;
        }
        var idx = 0; // 一段段的插入开头
        for (let n of list) {
            var txt = new TxtModel(
                this.referer,
                n.get('d').getString(),
                n.get('t').getInt(),
                n.get('c').getString(),
                n.get('b').getInt() > 0,
                n.get('i').getInt() > 0,
                n.get('u').getInt() > 0,
                n.get('w').getInt(),
                n.get('h').getInt(),
                n.get('url').getString(),
                n.get('ss').getInt() > 0
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
