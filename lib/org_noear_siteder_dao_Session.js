/*
 * Author:wistn
 * since:2019-10-14
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
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
Session.userID;
Session.nickname;
Session.icon;
Session.sex;
Session.isVip;
Session.level;
Session.city;
Session.sign;
Session.dayNum;
Session.vipTimeout;
Session.userInfoGetCount;
Session.isAccountChange;
if (Session.userID > 0) {
    Session.trySetAlias();
}
Session._uuid;
exports = module.exports = Session;
