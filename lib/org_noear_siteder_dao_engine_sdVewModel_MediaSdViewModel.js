/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var MediaModel = require('./org_noear_siteder_models_MediaModel.js');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase.js');
var TextUtils = require('./mytool.js').TextUtils;
class MediaSdViewModel extends ViewModelBase {
    // 从网页过来时，需要name,logo
    constructor() {
        super();
        this.items = [];
        this.name;
        this.logo;
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
                let obj = JSON.parse(json);
                if (Object.prototype.toString.call(obj) === '[object Object]') {
                    jList = obj.list || [];
                    if (TextUtils.isEmpty(this.name)) {
                        this.name = obj.name || '';
                        this.logo = obj.logo || '';
                    }
                } else {
                    jList = obj;
                }
                for (let n1 of jList) {
                    this.items.push(
                        new MediaModel(
                            n1.url || '',
                            n1.type || '',
                            n1.mime || '',
                            n1.logo || ''
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
