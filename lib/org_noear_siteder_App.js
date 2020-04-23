/*
 * Author:wistn
 * since:2019-10-26
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description:
 */
var DdApi = require('./org_noear_siteder_dao_engine_DdApi.js');
var DdAdapter = require('./org_noear_siteder_dao_engine_DdAdapter.js');

class App {
    onCreate() {
        App.mCurrent = this;
        DdApi.tryInit(new DdAdapter());
    }

    static getCurrent() {
        return App.mCurrent;
    }
}
App.mCurrent = null;
exports = module.exports = App;
