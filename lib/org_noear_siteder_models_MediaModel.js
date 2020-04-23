/*
 * Author:wistn
 * since:2020-01-03
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:音频视频模型
 */
var ModelBase = require('./org_noear_siteder_models_ModelBase.js');
class MediaModel extends ModelBase {
    constructor() {
        super();
        this.url;
        this.type; // 用于下载
        this.mime; // 用于下载
        this.logo; // 用于下载
        switch (arguments.length) {
            case 1: {
                let url = arguments[0];
                this.url = url;
                break;
            }
            case 4: {
                let url = arguments[0],
                    type = arguments[1],
                    mime = arguments[2],
                    logo = arguments[3];
                this.url = url;
                this.type = type;
                this.mime = mime;
                this.logo = logo;
                break;
            }
        }
    }
    getUri() {
        return this.url;
    }
    // 用于下载
    fileFullName(fileName) {
        return fileName + this.type;
    }
}
exports = module.exports = MediaModel;
