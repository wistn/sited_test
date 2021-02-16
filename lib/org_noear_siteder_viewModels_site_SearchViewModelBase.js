/*
 * Author:wistn
 * since:2019-12-21
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var SourceApi = require('./org_noear_siteder_dao_SourceApi');
var SearchSdViewModel = require('./org_noear_siteder_dao_engine_sdVewModel_SearchSdViewModel');
var TextUtils = require('./mytool').TextUtils;
class SearchViewModelBase extends SearchSdViewModel {
    constructor() {
        super();
        this.isOnlyFavs = false;
        this.isFilter = false;
        this.searchKey = null;
        this.searchFavsCount = 0;
    }
    // @Override
    doFilter(name) {
        if (this.isFilter) {
            if (SourceApi.isFilter(name)) return true;
        }

        return false;
    }

    // @Override
    doAddItem(b) {
        if (TextUtils.isEmpty(this.searchKey) == false) {
            if (
                b.name.length <= this.searchKey.length * 3 &&
                b.name.toLowerCase().indexOf(this.searchKey) >= 0
            ) {
                this.insertItem(b);
                return;
            }
        }

        this.addItem(b);
    }

    addItem(b) {}
    insertItem(b) {}
}
exports = module.exports = SearchViewModelBase;
