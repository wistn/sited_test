/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-04-18
 * Description:
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase.js');
var EncryptUtil = require('./me_noear_utils_EncryptUtil.js');
var DbApi = require('./org_noear_siteder_dao_db_DbApi.js');
class BookNode extends ModelBase {
    constructor() {
        super();
        this.name = ''; // 跟随java版构造对象默认值
        this.url = '';
        this.logo = '';
        this.author = '';
        this._bKey;
        this._bID = 0;
        this._cfg;
        this._obj;
        this._cover;
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
