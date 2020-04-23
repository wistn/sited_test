/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2020-04-24
 * Description:
 */
var PictureSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_PictureSdViewModel.js');
var StateTag = require('./org_noear_siteder_utils_StateTag.js');
var SectionModel = require('./org_noear_siteder_models_SectionModel.js');

class Section1ViewModel extends PictureSdViewModel {
    constructor() {
        super();
        this.newItems = []; // 新增项//用于记录当前加载新项的项目
        this.currentIndex;
        this.isSectionsAsc;
        this.currentSection = new SectionModel();
        this.fromSection = new SectionModel();
    }
    invertedIndex(index) {
        return this.total() - 1 - index;
    }

    invertedItem(index) {
        return this.get(this.invertedIndex(index));
    }

    // @Override
    clear() {
        this.items = [];
        this.newItems = [];
    }

    isNext() {
        var val;
        if (
            this.fromSection != null &&
            this.fromSection.orgIndex > this.currentSection.orgIndex
        ) {
            // 现在比之前的后面些
            // js版注：但我觉得是之前比现在的后面些
            val = true;
        } else {
            val = false;
        }

        if (this.isSectionsAsc) return !val;
        else return val;
    }

    isPrve() {
        var val;
        if (
            this.fromSection != null &&
            this.fromSection.orgIndex < this.currentSection.orgIndex
        ) {
            // 现在比之前的后面些
            val = true;
        } else {
            val = false;
        }

        if (this.isSectionsAsc) return !val;
        else return val;
    }

    // @Override
    loadByJson(config, ...jsons) {
        // java版: (String... jsons) 表示可变长度参数列表，参数为0到多个String类型的对象，或者是一个String[]。

        if (jsons == null || jsons.length == 0) return;
        // js版: (...jsons) 表示剩余参数组成的真数组，要Array.isArray(jsons[0])识别java版的多个String或者一个String[]
        if (jsons.length == 1 && Array.isArray(jsons[0])) {
            jsons = jsons[0];
        }
        // !this.currentSection.total是js版加的
        if (this.currentSection.total == 0 || !this.currentSection.total) {
            // 阅读时
            this.newItems = [];
            let state = new StateTag();
            state.isOk = this.isPrve(); // isOk = isBef

            for (let json of jsons) {
                this.loadByJsonData(config, json, state);
            }

            this.currentSection.total = state.value;

            if (state.isOk) {
                // 重新算位置 //isOk = isBef
                this.currentIndex = state.value; // 保持原位
            }
        }
    }

    // @Override
    doAddItem(pic, state) {
        if (state.isOk) {
            // isOk = isBef
            this.items.splice(state.value, 0, pic);
        } else {
            this.items.push(pic);
        }
        this.newItems.push(pic);
    }

    // @Override
    section() {
        return this.currentSection;
    }

    addItems(items) {
        this.items.push(...items);
    }
}
exports = module.exports = Section1ViewModel;
