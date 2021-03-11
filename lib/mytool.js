/*
 * Author:wistn
 * since:2019-12-17
 * LastEditors:Do not edit
 * LastEditTime:2021-03-02
 * Description: This file is about some alone functions which be required(reused) in the whole project,but not appropriate to be some alone Classes.
 */
class TextUtils {
    static isEmpty(str) {
        return str == null || str.length == 0;
    }
}

// function jsonToMap(jsonStr) {
//     let obj = JSON.parse(jsonStr);
//     let map = new Map();
//     for (let k of Object.keys(obj)) {
//         map.set(k, obj[k]);
//     }
//     return map;
// }
exports = module.exports = {
    TextUtils: TextUtils
};
