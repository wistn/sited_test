/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase');
var EncryptUtil = require('./me_noear_utils_EncryptUtil');
var DbApi = require('./org_noear_siteder_dao_db_DbApi');
class BookNode extends ModelBase {
    constructor() {
        super();
        this.name = null;
        this.url = null;
        this.logo = null;
        this.author = '';
        this._bKey = null;
        this._bID = 0;
        this._cfg = null;
        this._obj = null;
        this._cover = null;
        switch (arguments.length) {
            case 0: {
                break;
            }
            case 1: {
                let url = arguments[0];
                this.url = url;
                break;
            }
        }
    }
    //-----------
    bID() {
        this.tryInitBookNode();
        return this._bID;
    }
    bKey() {
        this.tryInitBookNode();
        return this._bKey;
    }
    tryInitBookNode() {
        if (this._bID == 0 && this.url != null) {
            this._bKey = EncryptUtil.md5(this.url);
            DbApi.logBID('', this._bKey, this.url);
            this._bID = DbApi.getBID(this._bKey);
        }
    }
    //----------
    cfg(source) {
        if (this._cfg == null) {
            this._cfg = source.book(this.url);
        }
        return this._cfg;
    }

    obj(source) {
        if (this._obj == null) {
            this._obj = source.objectExt(this.url);
        }
        return this._obj;
    }

    cover(source) {
        if (this._cover == null && source != null) {
            this._cover = source.cover(this.url);
        }
        return this._cover;
    }
    dtype(source) {
        return this.cfg(source).dtype();
    }
    webUrl(source) {
        if (source == null) return this.url;
        else return this.cfg(source).getWebUrl(this.url);
    }
}
exports = module.exports = BookNode;
