/*
 * Author:wistn
 * since:2019-10-13
 * LastEditors:Do not edit
 * LastEditTime:2020-05-17
 * Description:
 */
class __CacheBlock {
    constructor() {
        this.value = null;
        this.time = null;
    }
    isOuttime(config) {
        if (this.time == null || this.value == null) {
            return true;
        } else {
            if (config.cache == 1) return false;
            else {
                let seconds =
                    (new Date().getTime() - this.time.getTime()) / 1000;
                return seconds > config.cache;
            }
        }
    }
}
exports = module.exports = __CacheBlock;
