/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var BookModel = require('./org_noear_siteder_models_BookModel');
class BookUpdateModel extends BookModel {
    //    public static int CurrentIndex;
    constructor() {
        super();
        this.newSection = null;
        this.updateTime = null;
        this.status = null;
    }
}
exports = module.exports = BookUpdateModel;
