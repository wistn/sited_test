/*
 * Author:wistn
 * since:2019-10-26
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:保存文件编码是utf-8
 */
var fs = require('fs');
var path = require('path');
class LogWriter {
    constructor(dir, fileName) {
        this.mWriter;
        this.df;
        var file = path.join(dir + '/' + fileName); // java版是file文件（夹），nodejs改为文件路径
        try {
            //  this.mWriter = new BufferedWriter(new FileWriter(file, true), 2048);
            this.mWriter = fs.createWriteStream(file, {
                flags: 'a'
            });
            this.df = {
                format: function (d) {
                    let yy = ('' + d.getFullYear()).slice(-2),
                        MM = ('00' + (d.getMonth() + 1)).slice(-2),
                        dd = ('00' + d.getDate()).slice(-2),
                        hh = ('00' + d.getHours()).slice(-2),
                        mm = ('00' + d.getMinutes()).slice(-2),
                        ss = ('00' + d.getSeconds()).slice(-2);
                    return `[${yy}-${MM}-${dd} ${hh}:${mm}:${ss}]: `;
                }
            };
        } catch (ex) {
            this.mWriter = null;
            console.trace(ex);
        }
    }
    static tryInit() {
        if (LogWriter.loger == null) {
            // File _root = Setting.getFileRoot();
            var _root = path.join(__dirname, '..');
            LogWriter.loger = new LogWriter(_root, 'sited_log.txt');
            LogWriter.error = new LogWriter(_root, 'sited_error.txt');
            LogWriter.jsprint = new LogWriter(_root, 'sited_print.txt');
        }
    }
    static tryClose() {
        if (LogWriter.loger != null) {
            LogWriter.loger.close();
            LogWriter.error.close();
            LogWriter.jsprint.close();
            LogWriter.loger = null;
            LogWriter.error = null;
            LogWriter.jsprint = null;
        }
    }
    close() {
        if (this.mWriter == null) return;
        try {
            this.mWriter.end();
            this.df = null;
            this.mWriter = null;
        } catch (ex) {
            console.trace(ex);
        }
    }
    print(tag, msg, tr) {
        if (this.mWriter == null) return;
        try {
            this.mWriter.write(this.df.format(new Date()));
            this.mWriter.write('\r\n');
            this.mWriter.write(tag);
            this.mWriter.write('::');
            this.mWriter.write(msg);
            if (tr != null) {
                this.mWriter.write('\r\n');
                // StringBuffer sb = new StringBuffer();
                //    StackTraceElement[] list = tr.getStackTrace();
                // for (StackTraceElement s : list) {
                let s = tr.stack;
                this.mWriter.write('------- : ' + s);
                this.mWriter.write('\r\n');
                // }
            }
            this.mWriter.write('\r\n\r\n\n');
        } catch (ex) {
            console.trace(ex);
        }
    }
}
LogWriter.loger = null;
LogWriter.error = null;
LogWriter.jsprint = null;
exports = module.exports = LogWriter;
