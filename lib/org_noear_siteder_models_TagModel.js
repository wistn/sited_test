/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase.js');
class TagModel extends ModelBase {
    constructor() {
        super();
        this.name;
        this.url;
        this.type; // 0分类；1填空; 10分组；11分组填空
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
