/*
 * since:2019-08-14
 * LastEditors:Do not edit
 * LastEditTime:2020-04-06
 * Description: This jsfile is about some alone functions which be required(reused) in the whole project,but not appropriate to be some alone Classes.
 */
var fs = require('fs');

// function print(string) {
//     console.log(string);
// }
class TextUtils {
    static isEmpty(str) {
        return str == null || str.length == 0;
    }
}

function readlineSync(fd_in, callback) {
    var bufSize = 64 * 1024,
        buf = Buffer.alloc(bufSize);
    var lineNum = 0,
        leftOver = '';
    var n,
        lines = [],
        BOMchecked = false;
    var bufferSplitInto = function (buffer, array) {
        var idx = buffer.indexOf('\n');
        if (idx >= 0) {
            array.push(buffer.slice(0, idx));
            bufferSplitInto(buffer.slice(idx + 1), array);
        } else {
            array.push(buffer);
        }
    };
    while ((n = fs.readSync(fd_in, buf, 0, bufSize, null)) !== 0) {
        bufferSplitInto(buf.slice(0, n), lines);
        if (!BOMchecked) {
            if (lines[0].indexOf('\uFEFF') === 0) {
                lines[0] = lines[0].slice(3); // 去除BOM文件头
            }
            BOMchecked = true;
        }
        lines[0] = Buffer.concat([Buffer.from(leftOver, 'hex'), lines[0]]); // add leftover  from previous read
        while (lines.length > 1) {
            // process all but the last line
            lineNum++;
            callback(lines.shift().toString() + '\n', lineNum - 1);
        }
        leftOver = lines.shift().toString('hex'); // save last line  (may be '')，不转成utf8是因为3个字节大小的汉字如果只出现2个字节时是不完整，要和下一轮line[0]合并找回第3个字节。
    }
    callback(Buffer.from(leftOver, 'hex').toString(), lineNum);
}

// function jsonToMap(jsonStr) {
//     let obj = JSON.parse(jsonStr);
//     let map = new Map();
//     for (let k of Object.keys(obj)) {
//         map.set(k, obj[k]);
//     }
//     return map;
// }
exports = module.exports = {
    TextUtils: TextUtils,
    readlineSync: readlineSync
};
