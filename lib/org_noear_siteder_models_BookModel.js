/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var BookNode = require('./org_noear_siteder_dao_db_BookNode.js');
class BookModel extends BookNode {
    constructor() {
        super();
        this._id;
        this._dtype;
        this.btype;
        this.btag;
        this.index;
        this.source;
    }
}
exports = module.exports = BookModel;
