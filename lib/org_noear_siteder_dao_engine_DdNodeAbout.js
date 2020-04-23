/*
 * Author:wistn
 * since:2019-10-10
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var SdNode = require('./org_noear_sited_SdNode.js');
class DdNodeAbout extends SdNode {
    s() {
        return this.source;
    }
    constructor(source) {
        super(source);
        this.mail;
    }
    // @Override
    OnDidInit() {
        this.mail = this.attrs.getString('mail');
    }
    // 是否内部WEB运行
    isWebrun() {
        let run = this.attrs.getString('run');
        if (run == null) return false;
        return run.indexOf('web') >= 0;
    }
}
exports = module.exports = DdNodeAbout;
