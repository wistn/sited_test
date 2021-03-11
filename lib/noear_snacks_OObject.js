/*
 * Author:wistn
 * since:2021-03-02
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
class OObject {
    constructor() {
        this.members = new Map();
    }
    set(key, value) {
        this.members.set(key, value);
    }
    get(key) {
        return this.members.get(key);
    }
    contains(key) {
        return this.members.has(key);
    }
    count() {
        return this.members.size;
    }
    clear() {}
}
exports = module.exports = OObject;
