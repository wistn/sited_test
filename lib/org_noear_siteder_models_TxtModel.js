/*
 * Author:wistn
 * since:2020-01-04
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */

var ModelBase = require('./org_noear_siteder_models_ModelBase.js');
class TxtModel extends ModelBase {
    constructor() {
        super();
        this.referer;
        this.data;
        this.type;
        this.url;
        // 样式
        this.color;
        this.isBold;
        this.isItalic;
        this.isUnderline;
        this.width;
        this.height;
        this.isSectionOpen = false;
        switch (arguments.length) {
            case 4: {
                let referer = arguments[0],
                    data = arguments[1],
                    type = arguments[2],
                    b = arguments[3];
                this.referer = referer;
                this.data = data;
                this.type = type;
                this.isBold = b;
                if (this.type == 2) {
                    this.type = 1;
                    this.isBold = true;
                }
                break;
            }
            case 11: {
                let referer = arguments[0],
                    data = arguments[1],
                    type = arguments[2],
                    c = arguments[3],
                    b = arguments[4],
                    i = arguments[5],
                    u = arguments[6],
                    w = arguments[7],
                    h = arguments[8],
                    url = arguments[9],
                    ss = arguments[10];
                this.referer = referer;
                this.data = data;
                this.type = type;
                this.url = url;
                this.color = c;
                this.isBold = b;
                this.isItalic = i;
                this.isUnderline = u;
                this.width = w;
                this.height = h;
                this.isSectionOpen = ss;
                if (this.type == 2) {
                    this.type = 1;
                    this.isBold = true;
                }
                break;
            }
        }
    }
}
exports = module.exports = TxtModel;
