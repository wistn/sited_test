/*
 * Author:wistn
 * since:2019-12-21
 * LastEditors:Do not edit
 * LastEditTime:2020-04-08
 * Description:
 */
var SearchViewModelBase = require('./org_noear_siteder_viewModels_site_SearchViewModelBase.js');
var DbApi = require('./org_noear_siteder_dao_db_DbApi.js');
class SearchViewModel extends SearchViewModelBase {
    constructor() {
        super();
        this.isSearchMore;
        this.currentPage = 1;
        this.list = [];
    }

    // @Override
    clear() {
        this.list = [];
        this.currentPage = 1;
        this.searchFavsCount = 0;
    }

    // @Override
    total() {
        return this.list.length;
    }

    // @Override
    insertItem(b) {
        b.isFromFavs = DbApi.isFaved(b);
        this.list.splice(this.searchFavsCount, 0, b);
        this.searchFavsCount++;
        if (b.isFromFavs) {
            b.updateTime = '[已收藏]';
        }
    }

    // @Override
    addItem(b) {
        b.isFromFavs = DbApi.isFaved(b);
        if (b.isFromFavs) {
            b.updateTime = '[已收藏]';
            this.list.splice(this.searchFavsCount, 0, b);
            this.searchFavsCount++;
        } else {
            this.list.push(b);
        }
    }
}
exports = module.exports = SearchViewModel;
