/*
 * Author:wistn
 * since:2019-10-11
 * LastEditors:Do not edit
 * LastEditTime:2020-10-06
 * Description:
 */
class Base64Util {
    static encode(text) {
        return Buffer.from(text, 'UTF-8').toString('base64');
    }
    static decode(code) {
        let temp = Buffer.from(code, 'base64');
        return temp.toString();
    }
}
exports = module.exports = Base64Util;
