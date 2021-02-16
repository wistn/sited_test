/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2020-05-18
 * Description:
 */
var PicModel = require('./org_noear_siteder_models_PicModel');
var StateTag = require('./org_noear_siteder_utils_StateTag');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase');
var TextUtils = require('./mytool').TextUtils;
class PictureSdViewModel extends ViewModelBase {
    constructor() {
        super();
        this.bgUrl = null;
        this.items = [];
        // 从网页过来时，需要name,logo
        this.name = null;
        this.logo = null;
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
    /*
    支持
    ["","",""]
    或
    {bg:"",list:["","",""]}
    或
    {bg:"",list:[{url:"",time:"mm::ss.xx"},{...}]}
     或
    {bg:"",logo:"",name:"",list:[{url:"",time:"mm::ss.xx"},{...}]}
    */
    // @Override
    loadByJson(config, ...jsons) {
        // java版: (String... jsons) 表示可变长度参数列表，参数为0到多个String类型的对象，或者是一个String[]。
        if (jsons == null || jsons.length == 0) return;
        // js版: (...jsons) 表示剩余参数组成的真数组，要Array.isArray(jsons[0])识别java版的多个String或者一个String[]
        if (jsons.length == 1 && Array.isArray(jsons[0])) {
            jsons = jsons[0];
        }
        for (let json of jsons) {
            let state = new StateTag();
            this.loadByJsonData(config, json, state);
        }
    }
    loadByJsonData(config, json, state) {
        let list = null;
        let obj = JSON.parse(json);
        if ({}.toString.call(obj) === '[object Object]') {
            list = obj.list || [];
            let bg = obj.bg || '';
            if (TextUtils.isEmpty(bg) == false) {
                this.bgUrl = bg;
            }
            if (TextUtils.isEmpty(this.name)) {
                this.name = obj.name || '';
                this.logo = obj.logo || '';
            }
        } else {
            list = obj;
        }
        for (let n of list) {
            var pic = null;
            if ({}.toString.call(n) === '[object Object]') {
                pic = new PicModel(
                    this.section(),
                    n.url || '',
                    n.time || 0,
                    state.value
                );
            } else {
                pic = new PicModel(this.section(), n || '', 0, state.value);
            }
            if (TextUtils.isEmpty(pic.url)) {
                return;
            }
            pic.cacheID = this.items.length;
            this.doAddItem(pic, state);
            state.value++;
        }
    }
    doAddItem(pic, state) {}
    section() {}
}
exports = module.exports = PictureSdViewModel;
