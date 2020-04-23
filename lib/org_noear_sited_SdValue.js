/*
 * Author:wistn
 * since:2019-09-15
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description:
 */
var TextUtils = require('./mytool').TextUtils;

class SdValue {
    constructor() {
        this.value; // 静态值
        this.build; // 动态构建函数
        switch (arguments.length) {
            case 1: {
                let value = arguments[0];
                return new SdValue(value, null);
            }
            case 2: {
                let value = arguments[0],
                    def = arguments[1];
                this.value = value;
                if (value != null && value.startsWith('js:')) {
                    this.build = value.substring(3);
                    this.value = def;
                }
                break;
            }
        }
    }
    isEmpty() {
        return TextUtils.isEmpty(this.value) && TextUtils.isEmpty(this.build);
    }
    isEmptyValue() {
        return TextUtils.isEmpty(this.value);
    }
    isEmptyBuild() {
        return TextUtils.isEmpty(this.build);
    }
    //============================================================
    //
    //
    getValue(def) {
        if (this.value == null) return def;
        else return this.value;
    }
    indexOf(str) {
        if (this.value == null) return -1;
        else return this.value.indexOf(str);
    }
    //============================================================
    //
    //
    run() {
        switch (arguments.length) {
            case 2: {
                let sd = arguments[0],
                    args = arguments[1];
                return this.run(sd, args, this.value);
            }
            case 3: {
                let sd = arguments[0],
                    args = arguments[1],
                    defValue = arguments[2];
                if (TextUtils.isEmpty(this.build)) return defValue;
                else {
                    return sd.js.callJs(this.build, args);
                }
            }
        }
    }
}
exports = module.exports = SdValue;
