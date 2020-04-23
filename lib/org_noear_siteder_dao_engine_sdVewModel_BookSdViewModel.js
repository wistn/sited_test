/*
 * Author:wistn
 * since:2019-12-27
 * LastEditors:Do not edit
 * LastEditTime:2020-04-16
 * Description:
 */
var DdSource = require('./org_noear_siteder_dao_engine_DdSource.js');
var TextUtils = require('./mytool.js').TextUtils;
var Log = require('./android_util_Log.js');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase.js');
var SectionModel = require('./org_noear_siteder_models_SectionModel.js');

class BookSdViewModel extends ViewModelBase {
    constructor(url) {
        super();
        this.sections = [];
        this.name;
        this.author;
        this.intro;
        this.logo;
        this.updateTime;
        this.isSectionsAsc; // 输出的section是不是顺排的
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
        let data = JSON.parse(json); // 注意：java版ViewModel都是自定义类ONode,JsonReader。对于输出须要有转义符的文本插件（比较小众）和js版JSON.parse有不同效果
        if (DdSource.isBook(config)) {
            if (TextUtils.isEmpty(this.name)) {
                this.name = data.name || '';
                this.author = data.author || '';
                this.intro = data.intro || '';
                this.logo = data.logo || '';
                this.updateTime = data.updateTime || '';
                this.isSectionsAsc = (data.isSectionsAsc || 0) > 0; // 默认为倒排
            }
        }
        let sl = data.sections || [];
        for (let n of sl) {
            var sec = new SectionModel();
            sec.name = n.name || '';
            sec.url = n.url || '';
            sec.orgIndex = this.total();
            this.sections.push(sec);
            this.onAddItem(sec);
        }
        Log.v('loadByJsonData:', json);
    }
    //--------------
    clear() {
        this.sections = [];
    }
    total() {
        return this.sections.length;
    }
    get(idx) {
        if (this.sections == null) return null;

        let len = this.sections.length;
        if (idx >= len || idx < 0) return null;
        else return this.sections[idx];
    }
    onAddItem(sec) {}
}
exports = module.exports = BookSdViewModel;
