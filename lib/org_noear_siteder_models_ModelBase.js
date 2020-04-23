/*
 * Author:wistn
 * since:2019-10-24
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */

class ModelBase {
    constructor() {
        this.propertyChanged;
    }
    notifyPropertyChanged(propertyName) {
        if (this.propertyChanged != null) {
        }
    }
}
exports = module.exports = ModelBase;
