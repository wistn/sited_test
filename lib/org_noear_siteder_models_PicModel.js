/*
 * Author:wistn
 * since:2020-01-03
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase');
class PicModel extends ModelBase {
    // public DdSource source;
    constructor() {
        super();
        this.referer = null;
        this.url = null;
        this.time = 0;
        this.secIndex = 0;
        this.section = null;
        this.cacheID = 0;
        this.orgWidth = 0;
        this.orgHeight = 0;
        this.tmpWidth = 0;
        this.tmpHeight = 0;
        this.isPicLoaded = false;
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
