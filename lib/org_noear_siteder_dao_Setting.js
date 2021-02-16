/*
 * Author:wistn
 * since:2020-03-31
 * LastEditors:Do not edit
 * LastEditTime:2020-05-24
 * Description:
 */
class Setting {
    static isDeveloperModel() {
        return Boolean(global.isDeveloperModel); // global参数在根目录/index.js设置
    }
}

exports = module.exports = Setting;
