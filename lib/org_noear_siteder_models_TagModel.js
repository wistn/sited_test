/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase');
class TagModel extends ModelBase {
    constructor() {
        super();
        this.name = null;
        this.url = null;
        this.type = 0; // 0分类；1填空; 10分组；11分组填空
        switch (arguments.length) {
            case 3: {
                let name = arguments[0],
                    url = arguments[1],
                    type = arguments[2];
                this.name = name;
                this.url = url;
                this.type = type;
                break;
            }
            case 2: {
                let name = arguments[0],
                    url = arguments[1];
                this.name = name;
                this.url = url;
                this.type = 0;
                break;
            }
        }
    }
}
exports = module.exports = TagModel;
