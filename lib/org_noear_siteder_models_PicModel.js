/*
 * Author:wistn
 * since:2020-01-03
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase.js');
class PicModel extends ModelBase {
    // public DdSource source;
    constructor() {
        super();
        this.referer;
        this.url;
        this.time;
        this.secIndex;
        this.section;
        this.cacheID;
        this.orgWidth;
        this.orgHeight;
        this.tmpWidth;
        this.tmpHeight;
        this.isPicLoaded;
        switch (arguments.length) {
            case 2: {
                let referer = arguments[0],
                    url = arguments[1];
                this.referer = referer;
                this.section = null;
                this.secIndex = 0;
                this.url = url;
                this.time = 0;
                break;
            }
            case 4: {
                let section = arguments[0],
                    url = arguments[1],
                    time = arguments[2],
                    secIndex = arguments[3];
                this.referer = section.url;
                this.section = section;
                this.secIndex = secIndex;
                this.url = url;
                this.time = time;
                break;
            }
        }
    }
}
exports = module.exports = PicModel;
