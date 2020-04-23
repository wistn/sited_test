/*
 * Author:wistn
 * since:2020-04-07
 * LastEditors:Do not edit
 * LastEditTime:2020-04-08
 * Description:
 */
var BookSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_BookSdViewModel.js');
var SettingBookisSortUp = 1;
var TextUtils = require('./mytool.js').TextUtils;
class BookViewModel extends BookSdViewModel {
    constructor(s, n) {
        super(n.url);
        this._lastLookOrgIndex = -1;
        this._lastLook; // 根据url 生成 haskcode
        this.source = s;
        this.node = n;
        this.intro = '';
        this.isSortUp;
        this.isDownding;
        this.downList; // hashcodeList
        this._dtype = -1;
        this._sectionDownList = [];
        this._sectionUpList = [];
        this.lastLookUrl;
        this.lastLookUrlPage;
    }

    sectionList() {
        if (this.dtype() < 4) {
            this.isSortUp = SettingBookisSortUp;
        }
        return this.doSectionList();
    }

    dtype() {
        if (this._dtype < 0) {
            this._dtype = this.node.dtype(this.source);
        }
        return this._dtype;
    }

    doSectionList() {
        if (this.isSortUp) return this._sectionUpList;
        else return this._sectionDownList;
    }

    isDowned(item) {
        let hc = item.url.hashCode();
        for (let c of this.downList) {
            if (c == hc) return true;
        }
        return false;
    }
    //=============
    // @Override
    clear() {
        super.clear();
        this._sectionDownList = [];
        this._sectionUpList = [];
    }
    setLastLook(sectionUrl) {
        if (sectionUrl == null) return;
        this.lastLookUrl = sectionUrl;
        this._lastLook = sectionUrl.hashCode();
        let idx = 0;
        for (let sec of this._sectionDownList) {
            if (sec.code() == this._lastLook) {
                this._lastLookOrgIndex = idx;
                break;
            }
            idx++;
        }
    }

    lastLook() {
        return this._lastLook;
    }

    lastLookOrgIndex() {
        return this._lastLookOrgIndex;
    }

    lastLookIndex() {
        if (SettingBookisSortUp) {
            return this.total() - 1 - this._lastLookOrgIndex;
        } else {
            return this._lastLookOrgIndex;
        }
    }

    sectionCount() {
        return this.doSectionList().length;
    }

    getSectionByCode(code) {
        for (let sec of this.doSectionList()) {
            if (sec.code() == code) return sec;
        }
        return null;
    }

    getSection(idx) {
        let len = this.sectionCount();
        if (idx >= len || idx < 0) return null;
        else return this.doSectionList()[idx];
    }

    // @Override
    loadByJson(config, ...jsons) {
        super.loadByJson(config, ...jsons);
        //-----------
        if (TextUtils.isEmpty(this.logo) == false) this.node.logo = this.logo;
        else {
            if (TextUtils.isEmpty(this.logo)) {
                this.logo = this.node.logo;
            }
        }
        if (TextUtils.isEmpty(this.name) == false) {
            this.node.name = this.name;
        } else {
            if (TextUtils.isEmpty(this.name)) {
                this.name = this.node.name;
            }
        }
        if (TextUtils.isEmpty(this.author) == false) {
            this.node.author = this.author;
        }
    }

    // @Override
    onAddItem(sec) {
        sec.bookName = this.name;
        sec.bookUrl = this.node.url;
        sec.index = this.sectionCount();
        this._sectionDownList.push(sec);
        this._sectionUpList.splice(0, 0, sec);
    }

    addItemByEx(sec) {
        this.sections.push(sec);
        this.onAddItem(sec);
    }
}
exports = module.exports = BookViewModel;
