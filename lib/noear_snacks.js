/*
 * Author:wistn
 * since:2021-03-03
 * LastEditors:Do not edit
 * LastEditTime:2021-03-04
 * Description:
 */
var ONodeType = require('./noear_snacks_ONodeType');
var OArray = require('./noear_snacks_OArray');
var OValue = require('./noear_snacks_OValue');
var OObject = require('./noear_snacks_OObject');
class ONodeBase {
    constructor() {
        this._array = null;
        this._object = null;
        this._value = null;
        this._type = ONodeType.Null;
    }
    static tryLoad(ops) {
        return ONodeBase.load(ops);
    }
    static load(ops) {
        if (ops == null || ops.length < 2) return new ONode();
        if (ops[0] == '<') {
            // return ONodeBase.readXmlValue(new XmlReader(ops));
        } else {
            return ONodeBase.readJsonValue(JSON.parse(ops));
        }
    }
    tryInitValue() {
        if (this._value == null) this._value = new OValue();
        if (this._type != ONodeType.Value) this._type = ONodeType.Value;
    }
    tryInitObject() {
        if (this._object == null) this._object = new OObject();
        if (this._type != ONodeType.Object) this._type = ONodeType.Object;
    }
    tryInitArray() {
        if (this._array == null) this._array = new OArray();
        if (this._type != ONodeType.Array) this._type = ONodeType.Array;
    }
    isObject() {
        return this._type == ONodeType.Object;
    }
    isArray() {
        return this._type == ONodeType.Array;
    }
    asObject() {
        this.tryInitObject();
        return this;
    }
    asArray() {
        this.tryInitArray();
        return this;
    }
    setDouble(value) {
        this.tryInitValue();
        this._value.set(value);
    }
    setString(value) {
        this.tryInitValue();
        this._value.set(value);
    }
    setBoolean(value) {
        this.tryInitValue();
        this._value.set(value);
    }
    [Symbol.iterator]() {
        if (this.isArray()) return this._array.elements[Symbol.iterator]();
        else return null;
    }
    static readJsonValue(Value) {
        let instance = new ONode();
        let Token = Object.prototype.toString.call(Value).toLocaleLowerCase();
        if (Value == null) {
            instance._type = ONodeType.Null;
            return instance;
        }
        if (Token == '[object string]') {
            instance.setString(Value);
            return instance;
        }
        if (Token == '[object number]') {
            instance.setDouble(Value);
            return instance;
        }
        if (Token == '[object boolean]') {
            instance.setBoolean(Value);
            return instance;
        }
        if (Token == '[object array]') {
            instance.tryInitArray();
            for (let i in Value) {
                let item = ONodeBase.readJsonValue(Value[i]);
                instance.add(item);
            }
        } else if (Token == '[object object]') {
            instance.tryInitObject();
            for (let property in Value) {
                let val = ONodeBase.readJsonValue(Value[property]);
                instance.set(property, val);
            }
        }
        return instance;
    }
}
class ONode extends ONodeBase {
    constructor() {
        super(arguments);
        this._unescape = false;
        switch (arguments.length) {
            case 0: {
                break;
            }
            case 1: {
                let value = arguments[0];
                this.tryInitValue();
                this._value.set(value);
            }
        }
    }
    unescape(isUnescape) {
        this._unescape = isUnescape;
        return this;
    }
    getInt() {
        if (this._value == null) return 0;
        else return this._value.getInt();
    }
    getString() {
        if (this._value == null) return '';
        else {
            if (this._unescape) {
                // let str = this._value.getString();
                // if(str == null || str.length==0){
                //     return str;
                // }
                // try {
                //     StringWriter writer = new StringWriter(str.length);
                //     ONode.unescapeUnicode(writer, str);
                //     return writer.toString();
                // }
                // catch (ex){
                //     return str;
                // }
            } else {
                return this._value.getString();
            }
        }
    }
    get() {
        if (typeof arguments[0] == 'number') {
            let index = arguments[0];
            this.tryInitArray();
            if (this._array.elements.length > index)
                return this._array.elements[index].unescape(this._unescape);
            else return null;
        } else if (typeof arguments[0] == 'string') {
            let key = arguments[0];
            this.tryInitObject();
            if (this._object.contains(key)) {
                return this._object.get(key).unescape(this._unescape);
            } else {
                let temp = new ONode();
                this._object.set(key, temp);
                return temp;
            }
        }
    }
    add() {
        switch (arguments.length) {
            case 1: {
                let value = arguments[0];
                // 返回自己
                if (value instanceof ONode) {
                    this.tryInitArray();
                    this._array.add(value);
                    return this;
                } else {
                    return this.add(new ONode(value));
                }
            }
            case 2: {
                let value = arguments[0];
                let isOps = arguments[1];
                if (isOps) {
                    return this.add(ONode.tryLoad(value));
                } else {
                    return this.add(new ONode(value));
                }
            }
            case 0: {
                // 返回新节点
                let n = new ONode();
                this.add(n);
                return n;
            }
        }
    }
    set() {
        switch (arguments.length) {
            // 返回自己
            case 2: {
                let key = arguments[0];
                let value = arguments[1];
                if (value instanceof ONode) {
                    this.tryInitObject();
                    this._object.set(key, value);
                    return this;
                } else {
                    return this.set(key, new ONode(value));
                }
            }
            case 3: {
                let key = arguments[0];
                let value = arguments[1];
                let isOps = arguments[2];
                if (isOps) {
                    return this.set(key, ONode.tryLoad(value));
                } else {
                    return this.set(key, new ONode(value));
                }
            }
        }
    }
}
class FormatHanlder {
    run(e) {
        if (e == null) return 'null';
        else return e.toString();
    }
}
ONode.NULL_DEFAULT = 'null';
ONode.BOOL_USE01 = false;
ONode.TIME_FORMAT_ACTION = new FormatHanlder();
exports = module.exports = { ONode: ONode, ONodeBase: ONodeBase };
