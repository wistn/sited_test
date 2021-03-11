/*
 * Author:wistn
 * since:2021-03-02
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
var OValueType = require('./noear_snacks_OValueType');
class OValue {
    constructor() {
        this._int = 0;
        this._long = 0;
        this._double = 0;
        this._string = null;
        this._bool = false;
        this._date = 0;
        this.type = 0;
    }
    set(value) {
        switch (typeof value) {
            case 'number':
                this._double = value;
                this.type = OValueType.Double;
                break;
            case 'string':
                this._string = value;
                this.type = OValueType.String;
                break;
            case 'boolean':
                this._bool = value;
                this.type = OValueType.Boolean;
                break;
        }
    }
    getInt() {
        switch (this.type) {
            case OValueType.Int:
                return this._int;
            case OValueType.Long:
                return this._long;
            case OValueType.Double:
                return Math.trunc(this._double);
            case OValueType.String: {
                if (this._string == null || this._string.length == 0) return 0;
                else return parseInt(this._string, 10);
            }
            case OValueType.Boolean:
                return this._bool ? 1 : 0;
            case OValueType.DateTime:
                return 0;
            default:
                return 0;
        }
    }
    getString() {
        switch (this.type) {
            case OValueType.Int:
                return String(this._int);
            case OValueType.Long:
                return String(this._long);
            case OValueType.Double:
                return String(this._double);
            case OValueType.String:
                return this._string;
            case OValueType.Boolean:
                return String(this._bool);
            case OValueType.DateTime:
                return String(this._date);
            default:
                return '';
        }
    }
}
exports = module.exports = OValue;
