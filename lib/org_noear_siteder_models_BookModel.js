/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var BookNode = require('./org_noear_siteder_dao_db_BookNode');
class BookModel extends BookNode {
    constructor() {
        super();
        this._id = null;
        this._dtype = 0;
        this.btype = 0;
        this.btag = null;
        this.index = 0;
        this.source = null;
    }
}
exports = module.exports = BookModel;
