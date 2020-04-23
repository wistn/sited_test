/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var BookModel = require('./org_noear_siteder_models_BookModel.js');
class BookUpdateModel extends BookModel {
    //    public static int CurrentIndex;
    constructor() {
        super();
        this.newSection;
        this.updateTime;
        this.status;
    }
}
exports = module.exports = BookUpdateModel;
