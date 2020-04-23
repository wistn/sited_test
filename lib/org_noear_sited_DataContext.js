/*
 * Author:wistn
 * since:2019-10-09
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description:
 */
var DataBlock = require('./org_noear_sited_DataBlock.js');
class DataContext {
    constructor() {
        this._data = new Map();
    }
    add(node, tag, text) {
        if (this._data.has(node)) {
            this._data.get(node).set(tag, text);
        } else {
            var dt = new DataBlock();
            dt.set(tag, text);
            this._data.set(node, dt);
        }
    }
    nodes() {
        return this._data.keys();
    }
    get(node) {
        return this._data.get(node);
    }
}
exports = module.exports = DataContext;
