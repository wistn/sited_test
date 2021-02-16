/*
 * Author:wistn
 * since:2019-12-21
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var BookUpdateModel = require('./org_noear_siteder_models_BookUpdateModel');
class BookSearchModel extends BookUpdateModel {
    constructor() {
        super();
        this.isFromFavs = false;
    }
}
exports = module.exports = BookSearchModel;
