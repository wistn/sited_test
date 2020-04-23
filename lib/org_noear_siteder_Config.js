/*
 * Author:wistn
 * since:2019-11-15
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description:
 */
class Config {
    static isPhone() {
        if (Config._isPhone < 0) {
            Config._isPhone = Config.isTablet() ? 0 : 1;
            let cmd = 1001;
            if (cmd == 1001) Config._isPhone = 1;
            if (cmd == 1002) Config._isPhone = 0;
        }

        return Config._isPhone == 1;
    }

    static isTablet() {
        return 0;
    }
}
Config._isPhone = -1;
exports = module.exports = Config;
