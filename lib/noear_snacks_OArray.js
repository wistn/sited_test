/*
 * Author:wistn
 * since:2021-03-02
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
class OArray {
    constructor() {
        this.elements = [];
    }
    add() {
        switch (arguments.length) {
            case 1: {
                let value = arguments[0];
                this.elements.push(value);
                break;
            }
            case 2: {
                let index = arguments[0];
                let value = arguments[1];
                this.elements.splice(index, 0, value);
            }
        }
    }
    get(index) {
        return this.elements[index];
    }
    count() {
        return this.elements.length;
    }
    clear() {
        this.elements = [];
    }
}
exports = module.exports = OArray;
