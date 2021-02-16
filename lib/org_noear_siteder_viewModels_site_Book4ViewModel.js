/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2021-01-21
 * Description:
 */
var DdSource = require('./org_noear_siteder_dao_engine_DdSource');
var TextUtils = require('./mytool').TextUtils;
var PicModel = require('./org_noear_siteder_models_PicModel');
var PictureSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_PictureSdViewModel');
var SectionModel = require('./org_noear_siteder_models_SectionModel');
var Section1ViewModel = require('./org_noear_siteder_viewModels_site_Section1ViewModel');
var StateTag = require('./org_noear_siteder_utils_StateTag');
class Book4ViewModel extends PictureSdViewModel {
    constructor(source, n) {
        super();
        this.currentIndex = 0; // 加载时借用
        this._section = new SectionModel();
        this._section.url = n.url;
        this._section.name = '全部';
        this._section.bookUrl = n.url;
        this._section.bookName = '全部';
        this.bookUrl = n.url;
        this.node = n;
    }
    toSectionViewModel() {
        let vm = new Section1ViewModel();
        vm.currentIndex = 0;
        vm.currentSection = this._section;
        vm.addItems(this.items);
        return vm;
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
            if (json.indexOf('sections') > 0 || json.indexOf('intro') > 0) {
                this.loadByJsonForOld(config, json);
            } else {
                let state = new StateTag();
                this.loadByJsonData(config, json, state);
            }
        }
        //---------
        if (TextUtils.isEmpty(this.logo) == false) this.node.logo = this.logo;
        else this.logo = this.node.logo;
        if (TextUtils.isEmpty(this.name) == false) {
            this.node.name = this.name;
        }
    }
    // @Override
    doAddItem(pic, state) {
        this.items.push(pic);
    }
    // @Override
    section() {
        return this._section;
    }
    loadByJsonForOld(config, json) {
        let data = JSON.parse(json);
        if (DdSource.isBook(config) && TextUtils.isEmpty(this.name)) {
            this.name = data.name || '';
            this.logo = data.logo || '';
        }
        let sl = data.sections || [];
        for (let n of sl) {
            var pic = new PicModel(
                this.section(),
                n.url || '',
                0,
                this.items.length
            );
            this.items.push(pic);
        }
    }
}
exports = module.exports = Book4ViewModel;
