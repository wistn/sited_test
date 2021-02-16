/*
 * Author:wistn
 * since:2019-10-14
 * LastEditors:Do not edit
 * LastEditTime:2020-05-25
 * Description:
 */
class Session {
    static trySetAlias() {}
    static clear() {
        Session.userID = 0;
        Session.nickname = '';
        Session.icon = '';
        Session.sign = '';
        Session.city = '';
        Session.level = 0;
        Session.sex = 0;
        Session.isVip = 0;
        Session.dayNum = 0;
        Session.vipTimeout = '';
        Session.save();
        Session.isAccountChange = true;
    }
    static save() {}
    //
    //------------------
    //
    static udid() {
        return Session._uuid;
    }
}
Session.userID = 0;
Session.nickname = '';
Session.icon = '';
Session.sex = 0;
Session.isVip = 0;
Session.level = 0;
Session.city = '';
Session.sign = '';
Session.dayNum = 0;
Session.vipTimeout = '';
Session.userInfoGetCount = 0;
Session.isAccountChange = false;
if (Session.userID > 0) {
    Session.trySetAlias();
}
Session._uuid = null;
exports = module.exports = Session;
