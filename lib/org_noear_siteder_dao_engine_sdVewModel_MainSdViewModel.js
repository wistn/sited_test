/*
 * Author:wistn
 * since:2019-10-24
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase.js');
var DdSource = require('./org_noear_siteder_dao_engine_DdSource.js');
var BookModel = require('./org_noear_siteder_models_BookModel.js');
var BookUpdateModel = require('./org_noear_siteder_models_BookUpdateModel.js');
var TagModel = require('./org_noear_siteder_models_TagModel.js');
var DdNode = require('./org_noear_siteder_dao_engine_DdNode.js');
var Config = require('./org_noear_siteder_Config.js');
var TextUtils = require('./mytool.js').TextUtils;
var SdValue = require('./org_noear_sited_SdValue');
class MainSdViewModel extends ViewModelBase {
    constructor() {
        super();
        this.tagList = [];
        this.hotList = [];
        this.updateList = [];
    }
    clear() {
        this.tagList = [];
        this.hotList = [];
        this.updateList = [];
    }
    total() {
        return (
            this.tagList.length + this.hotList.length + this.updateList.length
        );
    }
    // @Override
    loadByConfig(config) {
        if (DdSource.isHots(config)) {
            this.hotList = [];
            for (let t1 of config.items()) {
                let b = new BookModel();
                b.name = t1.title;
                b.url = t1.url.value;
                b.logo = t1.logo;
                this.hotList.push(b);
            }
            return;
        }
        if (DdSource.isUpdates(config)) {
            this.updateList = [];
            for (let t1 of config.items()) {
                let b = new BookUpdateModel();
                b.name = t1.title;
                b.url = t1.url.value;
                b.logo = t1.logo;
                this.updateList.push(b);
            }
            return;
        }
        if (DdSource.isTags(config)) {
            this.tagList = [];
            var cfg = Object.assign(new DdNode(), config);
            for (let t1 of config.items()) {
                this.doAddTagItem(cfg, t1);
            }
        }
    }
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
            let data = JSON.parse(json);
            if (DdSource.isHots(config)) {
                for (let n of data) {
                    let b = new BookModel();
                    b.name = n.name || '';
                    b.url = n.url || '';
                    b.logo = n.logo || '';
                    this.hotList.push(b);
                }
                return;
            }
            if (DdSource.isUpdates(config)) {
                for (let n of data) {
                    let b = new BookUpdateModel();
                    b.name = n.name || '';
                    b.url = n.url || '';
                    b.logo = n.logo || '';
                    b.newSection = n.newSection || '';
                    b.updateTime = n.updateTime || '';
                    this.updateList.push(b);
                }
                return;
            }
            if (DdSource.isTags(config)) {
                let cfg = Object.assign(new DdNode(), config);
                for (let n of data) {
                    let t1 = new DdNode(null);
                    t1.title = n.title || '';
                    t1.url = new SdValue(n.url || '');
                    t1.group = n.group || '';
                    t1.logo = n.logo || '';
                    this.doAddTagItem(cfg, t1);
                }
            }
        }
    }
    doAddTagItem(cfg, t1) {
        if (Config.isPhone() && TextUtils.isEmpty(cfg.showImg) == false) {
            if (TextUtils.isEmpty(t1.group) == false) {
                this.tagList.push(new TagModel(t1.group, null, 10));
            }
            if (TextUtils.isEmpty(t1.title) == false) {
                this.tagList.push(new TagModel(t1.title, t1.url.value, 0));
            }
        } else {
            if (TextUtils.isEmpty(t1.group) == false) {
                let temp = this.tagList.length % 3;
                if (temp > 0) {
                    temp = 3 - temp;
                }
                while (temp > 0) {
                    this.tagList.push(new TagModel('', null, 1));
                    temp--;
                }
                this.tagList.push(new TagModel('', null, 11));
                this.tagList.push(new TagModel(t1.group, null, 10));
                this.tagList.push(new TagModel('', null, 11));
            }
            if (TextUtils.isEmpty(t1.title) == false) {
                this.tagList.push(new TagModel(t1.title, t1.url.value, 0));
            }
        }
    }
}
exports = module.exports = MainSdViewModel;
