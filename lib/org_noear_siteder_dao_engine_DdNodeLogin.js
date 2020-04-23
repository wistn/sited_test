/*
 * Author:wistn
 * since:2019-10-09
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
var SdNode = require('./org_noear_sited_SdNode.js');
var TextUtils = require('./mytool.js').TextUtils;
var SdAttributeList = require('./org_noear_sited_SdAttributeList');
class DdNodeLogin extends SdNode {
    s() {
        return this.source;
    }
    // 只应用于login节点
    constructor(source) {
        super(source);
        this.onCheck;
        this.isAutoCheck = true;
    }
    // @Override
    OnDidInit() {
        this.onCheck = this.attrs.getString2('onCheck', 'check'); // 控制外部浏览器的打开
        this.isAutoCheck = this.attrs.getInt('auto') > 0; // 返回布尔值
    }
    // 是否内部WEB运行
    isWebrun() {
        let run = this.attrs.getString('run');
        if (run == null) return false;
        return run.indexOf('web') >= 0;
    }
    doCheck(url, cookies, isFromAuto) {
        if (TextUtils.isEmpty(this.onCheck)) {
            return true;
        } else {
            if (url == null || cookies == null) return false;
            let attrs = new SdAttributeList();
            attrs.set('url', url);
            attrs.set('cookies', cookies == null ? '' : cookies);
            if (isFromAuto) {
                if (this.isAutoCheck) {
                    let temp = this.source.callJs(this.onCheck, attrs);
                    return temp == '1';
                } else {
                    return true; // 如果不支持自动,则总是返回ok
                }
            } else {
                let temp = this.source.callJs(this.onCheck, attrs);
                return '1' == temp;
            }
        }
    }
}
exports = module.exports = DdNodeLogin;
