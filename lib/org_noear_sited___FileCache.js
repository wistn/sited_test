/*
 * Author:wistn
 * since:2019-09-16
 * LastEditors:Do not edit
 * LastEditTime:2020-04-11
 * Description:
 */
var SdApi = require('./org_noear_sited_SdApi.js');
var fs = require('fs');
var path = require('path');
var Util = require('./org_noear_sited_Util.js');
var readlineSync = require('./mytool.js').readlineSync;
var __CacheBlock = require('./org_noear_sited___CacheBlock.js');

class __FileCache {
    constructor(context, block) {
        var _root = SdApi.cacheRoot(); // 结果为null
        //         if (_root == null) {
        //             _root = context.getExternalFilesDir(null);
        //         }
        //         if (_root == null) {
        //             _root = context.getFilesDir();
        //         }
        if (_root == null) {
            _root = path.join(__dirname, '..');
        }
        this.dir = path.join(_root + '/' + block); // java版是file文件（夹），nodejs改为文件（夹）路径
        if (!fs.existsSync(this.dir)) {
            fs.mkdirSync(this.dir);
        }
    }
    getFile(key) {
        let key_md5 = Util.md5(key);
        let String_path = key_md5.substring(0, 2);
        let dir2 = path.join(this.dir + '/' + String_path);
        if (fs.existsSync(dir2) == false) {
            fs.mkdirSync(dir2);
        }
        return path.join(dir2 + '/' + key_md5); // java版是返回文件对象，js版返回文件路径
    }

    save(key, data) {
        if (!global.enableFileCache) return; // global参数在根目录/index.js设置
        let file = this.getFile(key);
        try {
            fs.writeFileSync(file, data, 'utf8');
        } catch (ex) {
            console.trace(ex);
        }
    }
    get(key) {
        let file = this.getFile(key); // java版是返回文件对象，js版返回文件路径
        if (fs.existsSync(file) == false) return null;
        else {
            try {
                let block = new __CacheBlock();
                block.value = __FileCache.toString(file);
                block.time = new Date(fs.statSync(file).mtimeMs);
                return block;
            } catch (ex) {
                console.trace(ex);
                return null;
            }
        }
    }
    delete(key) {
        let file = this.getFile(key);
        if (fs.existsSync(file)) {
            fs.unlinkSync(file); // 只能删除文件。
        }
    }
    isCached(key) {
        let file = this.getFile(key);
        return fs.existsSync(file);
    }
    // --------
    static toString(is) {
        let fd_in = fs.openSync(is, 'r');
        let string = this.doToString(fd_in);
        fs.closeSync(fd_in);
        return string;
    }
    static doToString(fd_in) {
        let buffer = [];
        readlineSync(fd_in, function (line) {
            buffer.push(line, '\r\n');
        });
        return buffer.join('');
    }
}

exports = module.exports = __FileCache;
