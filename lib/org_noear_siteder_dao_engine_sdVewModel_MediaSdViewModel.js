/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
var MediaModel = require('./org_noear_siteder_models_MediaModel');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase');
var TextUtils = require('./mytool').TextUtils;
var ONode = require('./noear_snacks_ONode');
class MediaSdViewModel extends ViewModelBase {
    // 从网页过来时，需要name,logo
    constructor() {
        super();
        this.items = [];
        this.name = null;
        this.logo = null;
    }
    total() {
        return this.items.length;
    }
    clear() {
        this.items = [];
    }
    get(index) {
        return this.items[index];
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
            if (json.startsWith('{') || json.startsWith('[')) {
                let jList = null;
                let obj = ONode.tryLoad(json);
                if (obj.isObject()) {
                    jList = obj.get('list').asArray();
                    if (TextUtils.isEmpty(this.name)) {
                        this.name = obj.get('name').getString();
                        this.logo = obj.get('logo').getString();
                    }
                } else {
                    jList = obj;
                }
                for (let n1 of jList) {
                    this.items.push(
                        new MediaModel(
                            n1.get('url').getString(),
                            n1.get('type').getString(),
                            n1.get('mime').getString(),
                            n1.get('logo').getString()
                        )
                    );
                }
            } else {
                for (let url of json.split(';')) {
                    if (url.length > 6) {
                        this.items.push(new MediaModel(url));
                    }
                }
            }
        }
    }
}
exports = module.exports = MediaSdViewModel;
