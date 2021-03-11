/*
 * Author:wistn
 * since:2019-12-16
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase');
var BookUpdateModel = require('./org_noear_siteder_models_BookUpdateModel');
var ONode = require('./noear_snacks_ONode');
class TagSdViewModel extends ViewModelBase {
    constructor() {
        super();
        this.list = [];
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
            // 支持多个数据块加载
            let data = ONode.tryLoad(json);
            if (data.isArray()) {
                for (let n of data) {
                    let name = n.get('name').getString();
                    var b = new BookUpdateModel();
                    b.name = name;
                    b.url = n.get('url').getString();
                    b.logo = n.get('logo').getString();
                    b.author = n.get('author').getString();
                    b.newSection = n.get('newSection').getString();
                    b.updateTime = n.get('updateTime').getString();
                    b.status = n.get('status').getString();
                    this.list.push(b);
                }
            }
        }
    }
    clear() {
        this.list = [];
    }
    total() {
        return this.list.length;
    }
    get(index) {
        return this.list[index];
    }
}
exports = module.exports = TagSdViewModel;
