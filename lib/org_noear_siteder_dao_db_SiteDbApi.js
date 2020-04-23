/*
 * Author:wistn
 * since:2019-10-09
 * LastEditors:Do not edit
 * LastEditTime:2020-04-24
 * Description:
 */
var DbContext = require('./me_noear_db_DbContext.js');
var EncryptUtil = require('./me_noear_utils_EncryptUtil.js');
var Log = require('./android_util_Log.js');
class SiteDbApi {
    static get SiteDbContext() {
        return class SiteDbContext extends DbContext {
            constructor(context) {
                super(context, 'sitedb', 11);
            }
        };
    }
    static setSourceCookies(sd) {}
    static setSourceUsetime(sd) {
        this.db.updateSQL(
            'UPDATE  sites SET logTime=? WHERE key=?;',
            new Date().getTime(),
            sd.url_md5
        );
    }
    static getSourceCookies(sd) {
        let temp = this.getSourceByKey(sd.url_md5);
        if (temp == null) return null;
        else return temp.cookies;
    }
    static getSourceByKey(key) {}
}
if (SiteDbApi.db == null) {
    SiteDbApi.db = new SiteDbApi.SiteDbContext('App.getContext()');
}
exports = module.exports = SiteDbApi;
