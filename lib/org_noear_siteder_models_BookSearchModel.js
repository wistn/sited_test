/*
 * Author:wistn
 * since:2019-12-21
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var BookUpdateModel = require('./org_noear_siteder_models_BookUpdateModel.js');
class BookSearchModel extends BookUpdateModel {
    constructor() {
        super();
        this.isFromFavs;
    }
}
exports = module.exports = BookSearchModel;
