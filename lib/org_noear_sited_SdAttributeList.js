/*
 * Author:wistn
 * since:2019-09-14
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description:
 */
var SdValue = require('./org_noear_sited_SdValue');
var Util = require('./org_noear_sited_Util');
class SdAttributeList {
    constructor() {
        this._items = new Map();
        this._values = [];
    }
    getValues() {
        return this._values;
    }
    getJson() {
        return Util.toJson(this._items);
    }
    count() {
        return this._items.size;
    }
    clear() {
        this._items.clear();
    }
    contains(key) {
        return this._items.has(key);
    }
    set(key, val) {
        this._items.set(key, val);
        this._values.push(val);
    }
    getValue() {
        switch (arguments.length) {
            case 1: {
                let key = arguments[0];
                return this.getValue(key, null);
            }
            case 2: {
                let key = arguments[0],
                    def = arguments[1];
                let val = this.getString(key);
                return new SdValue(val, def);
            }
        }
    }
    getString2(key, key2) {
        if (this.contains(key)) {
            return this.getString(key, null);
        } else {
            return this.getString(key2, null);
        }
    }
    getString() {
        switch (arguments.length) {
            case 1: {
                let key = arguments[0];
                return this.getString(key, null);
            }
            case 2: {
                let key = arguments[0],
                    def = arguments[1];
                if (this.contains(key)) {
                    return this._items.get(key);
                } else {
                    return def;
                }
            }
        }
    }
    getInt() {
        switch (arguments.length) {
            case 1: {
                let key = arguments[0];
                return this.getInt(key, 0);
            }
            case 2: {
                let key = arguments[0],
                    def = arguments[1];
                if (this.contains(key)) {
                    return Number(this._items.get(key));
                } else {
                    return def;
                }
            }
        }
    }
    getLong() {
        switch (arguments.length) {
            case 1: {
                let key = arguments[0];
                return this.getLong(key, 0);
            }
            case 2: {
                let key = arguments[0],
                    def = arguments[1];
                if (this.contains(key)) {
                    return Number(this._items.get(key));
                } else {
                    return def;
                }
            }
        }
    }
    addAll(attrs) {
        // 浅拷贝（引用对象）对应java上HashMap.putAll
        for (let [key, value] of attrs._items.entries()) {
            this._items.set(key, value);
        }
    }
}
exports = module.exports = SdAttributeList;
