/*
 * Author:wistn
 * since:2019-10-11
 * LastEditors:Do not edit
 * LastEditTime:2020-05-04
 * Description: 算法工具
 */
var md5 = require('./main_res_raw_md5');
class EncryptUtil {
    /* 生成MD5值*/
    static md5(code) {
        var s = null;
        try {
            s = md5(code);
        } catch (e) {
            console.trace(e);
        }
        return s;
    }

    /* 生成sha1值*/
    static sha1(code) {
        return null;
    }
}
exports = module.exports = EncryptUtil;
