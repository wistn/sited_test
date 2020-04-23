/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase.js');
class SectionModel extends ModelBase {
    constructor() {
        super();
        this.index;
        this.orgIndex;
        this.url;
        this.name;
        this.bookName;
        this.bookUrl;
        this.total;
        this._code;
        this.downTotal;
        this.downProgress;
        this._cfg;
        // 由外部传值
        this._config;
    }
    // public boolean isGroup;//是否为分组
    // pic total
    //	public Boolean isLooking;
    //	public Boolean isSectionCache;
    //	public Boolean isDowning;
    //
    //	public int barMaximum;
    //	public int barValue;
    code() {
        if (this._code == 0 && this.url != null) {
            this._code = this.url.hashCode();
        }
        return this._code;
    }
    cfg(source) {
        if (this._cfg == null) {
            this._cfg = source.section(this.url);
        }
        return this._cfg;
    }
}
exports = module.exports = SectionModel;
