/*
 * Author:wistn
 * since:2019-12-30
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase');
class SectionModel extends ModelBase {
    constructor() {
        super();
        this.index = 0;
        this.orgIndex = 0;
        this.url = null;
        this.name = null;
        this.bookName = null;
        this.bookUrl = null;
        this.total = 0;
        this._code = 0;
        this.downTotal = 0;
        this.downProgress = 0;
        this._cfg = null;
        // 由外部传值
        this._config = null;
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
