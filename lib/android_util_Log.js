/*
 * Author:wistn
 * since:2019-10-10
 * LastEditors:Do not edit
 * LastEditTime:2021-03-04
 * Description:
 */
var fs = require('fs');
var path = require('path');
class Log {
    // 模仿安卓 logcat 转储消息日志，每条截取前几百个字符
    static v(tag, msg) {
        fs.appendFileSync(
            path.resolve(__dirname, '..', 'files', 'logcat_stdout.txt'),
            new Date().toLocaleTimeString() +
                ' VERBOSE/' +
                tag +
                ': ' +
                (msg ? msg.slice(0, 150) + ' ...' : '') +
                '\r\n',
            'utf8'
        );
        // global参数在根目录/index.js设置
        if (global.VERBOSE_log) {
            console.log(
                'VERBOSE/' +
                    tag +
                    ': ' +
                    (msg ? msg.slice(0, 150) + ' ...' : '')
            );
        } else if (global.VERBOSE_trace) {
            console.trace(
                'VERBOSE/' +
                    tag +
                    ': ' +
                    (msg ? msg.slice(0, 150) + ' ...' : '')
            );
        }
    }
    static i(tag, msg) {
        fs.appendFileSync(
            path.resolve(__dirname, '..', 'files', 'logcat_stdout.txt'),
            new Date().toLocaleTimeString() +
                ' INFO/' +
                tag +
                ': ' +
                msg +
                '\r\n',
            'utf8'
        );
        // console.trace('INFO/' + tag + ': ' + msg);
    }
    static e(tag, msg) {
        fs.appendFileSync(
            path.resolve(__dirname, '..', 'files', 'logcat_stdout.txt'),
            new Date().toLocaleTimeString() +
                ' ERROR/' +
                tag +
                ': ' +
                msg +
                '\r\n',
            'utf8'
        );
        console.trace('ERROR/' + tag + ': ' + msg);
    }
    static w(tag, msg) {
        fs.appendFileSync(
            path.resolve(__dirname, '..', 'files', 'logcat_stdout.txt'),
            new Date().toLocaleTimeString() +
                ' WARN/' +
                tag +
                ': ' +
                msg +
                '\r\n',
            'utf8'
        );
        console.trace('WARN/' + tag + ': ' + msg);
    }
    static d(tag, msg) {
        fs.appendFileSync(
            path.resolve(__dirname, '..', 'files', 'logcat_stdout.txt'),
            new Date().toLocaleTimeString() +
                ' DEBUG/' +
                tag +
                ': ' +
                msg +
                '\r\n',
            'utf8'
        );
        console.trace('DEBUG/' + tag + ': ' + msg);
    }
}
exports = module.exports = Log;
