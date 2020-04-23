/*
 * Author:wistn
 * since:2019-09-13
 * LastEditors:Do not edit
 * LastEditTime:2020-04-24
 * Description:
 */
class Util {
    static tryInitCache(context) {
        if (this.cache == null) {
            this.cache = new __FileCache(context, 'sited');
        }
    }
    static getElement(n, tag) {
        var temp = n.find(tag);
        if (temp.length > 0) return temp.eq(0);
        else return null;
    }
    static getXmlroot(xml) {
        var $_ = nativeCheerio.load(xml, {
            xmlMode: true,
            // xml相关options参见https://github.com/fb55/htmlparser2/wiki/Parser-options
            decodeEntities: true // 默认true即去除xml转义
        }); // 定义$_通过原生cheerio库读取sited插件（xml格式文件）,以区别多多猫版cheerio库解析html的$。因为多多猫版cheerio库(0.19.0)对于新版原生cheerio库(1.0.0-rc.3)功能缺失比如读取xml格式文件效果等
        return $_.root().children().eq(0);
    }
    //
    //----------------------------
    //
    static urlEncode(str, config) {
        try {
            return charset_encodeURIComponent(str, config.encode()).replace(
                /%20/g,
                '+'
            );
            // java版是java.net.URLEncoder.encode（可指定字符集），编码遵循application/x-www-form-urlencoded标准，会将空格编码成加号，其余字符接近用encodeURIComponent处理而不是encodeURI
        } catch (ex) {
            return '';
        }
    }
    static http(source, isUpdate, msg) {
        SdApi.log(source, 'Util.http', msg.url);
        var cacheKey2 = null;
        var args = '';
        if (msg.form == null) cacheKey2 = msg.url;
        else {
            var sb = [];
            sb.push(msg.url);
            for (let key of msg.form.keys()) {
                sb.push(key, '=', msg.form.get(key), ';');
            }
            cacheKey2 = sb.join('');
            args = cacheKey2;
        }
        var cacheKey = cacheKey2;
        var block = this.cache.get(cacheKey);
        if (isUpdate == false && msg.config.cache > 0) {
            if (block != null && block.isOuttime(msg.config) == false) {
                let block1 = block;
                // java版用new Handler().postDelayed延迟，才能满足对异步请求的回调顺序控制
                setTimeout(() => {
                    SdApi.log(source, 'Util.incache.url', msg.url);
                    msg.callback(1, msg, block1.value, null);
                }, 100);
                return;
            }
        }
        this.doHttp(source, msg, block, (code, msg2, data, url302) => {
            if (code == 1) {
                this.cache.save(cacheKey, data);
            }
            msg.callback(code, msg2, data, url302);
        });
        source.DoTraceUrl(msg.url, args, msg.config);
    }
    static doHttp(source, msg, cache, callback) {
        // java版是用 synchronized doHttp请求，nodejs是异步请求库
        var options = {
            headers: {
                'User-Agent': msg.ua
            },
            maxRedirects: 0,
            responseType: 'arraybuffer',
            validateStatus: (status) => status < 400
        };
        if (msg.url.indexOf(' ') > 0) {
            // java版。indexOf()>0 会影响com.loopj.android.http.AsyncHttpClient类的getUrlWithQueryString(boolean shouldEncodeUrl
            msg.url = msg.url.replace(/ /g, '%20');
        }
        for (let key of msg.header.keys()) {
            options.headers[key] = msg.header.get(key);
        }
        var httpTag = new __AsyncTag();
        var responseHandler = (response) => {
            let statusCode = response.status;
            response.body = response.data;
            response.url = response.config.url;
            if (statusCode == 302 || statusCode == 301) {
                msg.url = response.url;
                httpTag.str0 = response.headers.location;
                if (httpTag.str0.startsWith('http') == false) {
                    var uri = {
                        protocol: msg.url.match(/(^.+?)\/\//)[1],
                        hostname: msg.url.match(/\/\/([^/:]+)/)[1],
                        pathname: msg.url.match(/\/\/[^/]+(\/[^?#]*)/)
                            ? msg.url.match(/\/\/[^/]+(\/[^?#]*)/)[1]
                            : '/'
                    };
                    if (httpTag.str0.startsWith('/')) {
                        httpTag.str0 =
                            uri.protocol + '//' + uri.hostname + httpTag.str0;
                    } else {
                        var path = uri.pathname;
                        var idx = path.lastIndexOf('/');
                        if (idx > 0) {
                            path = path.substring(0, idx);
                            httpTag.str0 =
                                uri.protocol +
                                '//' +
                                uri.hostname +
                                path +
                                '/' +
                                httpTag.str0;
                        }
                    }
                }
                Log.v('orgurl', msg.url);
                Log.v('302url', httpTag.str0);
                if (options.headers['Content-type'])
                    delete options.headers['Content-type'];
                axios.get(httpTag.str0, options).then((res) => {
                    responseHandler(res);
                });
            } else if (statusCode < 200 || statusCode > 299) {
                SdApi.log(
                    source,
                    'http.onFailure',
                    response.url + ' status code: ' + statusCode
                );
                console.log(
                    'http.onFailure',
                    response.url + ' status code: ' + statusCode
                );
                if (cache == null || cache.value == null)
                    callback(-2, msg, null, null);
                else callback(1, msg, cache.value, httpTag.str0);
            } else {
                var sb = [];
                if (response.headers) {
                    for (let [Name, Value] of Object.entries(
                        response.headers
                    )) {
                        if ('Set-Cookie'.toUpperCase() == Name.toUpperCase()) {
                            if (Array.isArray(Value)) {
                                for (let val of Value) {
                                    sb.push(val, ';');
                                }
                            } else {
                                sb.push(Value, ';');
                            }
                        }
                    }
                }
                if (sb.length > 0) {
                    source.setCookies(sb.join(''));
                }
                callback(
                    1,
                    msg,
                    iconv.decode(response.body, msg.encode),
                    httpTag.str0
                );
            }
        };
        try {
            var idx = msg.url.indexOf('#'); // 去除hash，即#.*
            var url2 = null;
            if (idx > 0) url2 = msg.url.substring(0, idx);
            else url2 = msg.url;
            if ('post' == msg.method) {
                let postData = [];
                for (let [key, value] of msg.form.entries()) {
                    postData.push(
                        charset_encodeURIComponent(key, msg.encode).replace(
                            /%20/g,
                            '+'
                        ) +
                            '=' +
                            charset_encodeURIComponent(
                                value,
                                msg.encode
                            ).replace(/%20/g, '+')
                    );
                    // converting a String to the application/x-www-form-urlencoded MIME format，空格转义为加号
                }
                postData = postData.join('&');
                console.log(
                    '发出post参数（x-www-form-urlencoded编码） ' + postData
                );
                options.headers['Content-type'] =
                    'application/x-www-form-urlencoded';
                axios.post(url2, postData, options).then((res) => {
                    responseHandler(res);
                });
            } else {
                axios
                    .get(url2, options)
                    .then((res) => {
                        responseHandler(res);
                    })
                    .catch((err) => {
                        console.trace(err);
                    });
            }
        } catch (ex) {
            if (cache == null) callback(-2, msg, null, null);
            else callback(1, msg, cache.value, null);
        }
    }
    /* 生成MD5值*/
    static md5(code) {
        let s = null;
        try {
            s = md5(code);
        } catch (e) {
            e.console.trace(e);
        }
        return s;
    }
    //-------------
    //
    static toJson(data) {
        let sb = [];
        if (data != null) {
            sb.push('{');
            for (let k of data.keys()) {
                let v = data.get(k);
                sb.push('"', k, '"', ':');
                if (v.startsWith('{')) {
                    // 表示v是对象
                    sb.push(v);
                } else {
                    this._WriteValue(sb, v);
                }
                sb.push(',');
            }
            if (sb.length > 4) {
                sb.pop();
            }
            sb.push('}');
        } else {
            sb.push('{}');
        }
        return sb.join('');
    }
    static _WriteValue(_Writer, val) {
        if (val == null) {
            _Writer.push('null');
        } else {
            _Writer.push('"');
            let n = val.length;
            let c;
            for (let i = 0; i < n; i++) {
                c = val.charAt(i);
                switch (c) {
                    case '\\':
                        _Writer.push('\\\\'); // 20110809
                        break;
                    case '"':
                        _Writer.push('\\"'); // json的key、value用双引号包裹，所以被包裹字符串里要反斜杠转义双引号，还要反斜杠之前再加反斜杠将其转义以防止eval时它被用于转义
                        break;
                    case '\n':
                        _Writer.push('\\n');
                        break;
                    case '\r':
                        _Writer.push('\\r');
                        break;
                    case '\t':
                        _Writer.push('\\t');
                        break;
                    case '\f':
                        _Writer.push('\\f');
                        break;
                    case '\b':
                        _Writer.push('\\b');
                        break;
                    default:
                        _Writer.push(c);
                        break;
                }
            }
            _Writer.push('"');
        }
    }
}
Util.NEXT_CALL = 'CALL::';
Util.defUA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240';
Util.cache = null;
exports = module.exports = Util;
// 先exports然后require，解决2个模块循环依赖问题
var Log = require('./android_util_Log.js');
var nativeCheerio = require('cheerio'); // 引入原生cheerio库，详见调用处
var __FileCache = require('./org_noear_sited___FileCache');
var md5 = require('./main_res_raw_md5.js');
var SdApi = require('./org_noear_sited_SdApi.js');
var iconv = require('iconv-lite');
var __AsyncTag = require('./org_noear_sited___AsyncTag.js');
var axios = require('axios'); // 若maxRedirects: 0时301/302状态当成failure，不删除catch的话要 validateStatus: (status) => status < 400

function charset_encodeURI(str, charset) {
    if (
        !charset ||
        charset.toLowerCase() === 'utf8' ||
        charset.toLowerCase() === 'utf-8'
    )
        return encodeURI(str); // take encodeURI.js(https://github.com/jonelf/encodeURI.js/blob/master/lib/encodeURI.js) as reference
    var buf = iconv.encode(str, charset);
    var list = [];
    for (var cc of buf.values()) {
        if (
            (97 <= cc && cc <= 122) || // a - z
            (65 <= cc && cc <= 90) || // A - Z
            (48 <= cc && cc <= 57) || // 0 - 9
            cc == 33 || // !
            (35 <= cc && cc <= 36) || // #$
            (38 <= cc && cc <= 47) || // &'()*+,-./
            (58 <= cc && cc <= 59) || // :;
            cc == 61 || // =
            (63 <= cc && cc <= 64) || // ?@
            cc == 91 ||
            cc == 93 || // []for IPv6
            cc == 95 ||
            cc == 126 // _ ~
        ) {
            list.push(String.fromCharCode(cc));
        } else {
            var hex = cc.toString(16).toUpperCase();
            list.push('%' + (hex.length === 1 ? '0' + hex : hex));
        }
    }
    return list.join('');
}
function charset_decodeURI(str, charset) {
    if (
        !charset ||
        charset.toLowerCase() === 'utf8' ||
        charset.toLowerCase() === 'utf-8'
    )
        return decodeURI(str);
    if (!str.match(/%[a-zA-Z\d]{2}/)) return decodeURI(str);
    var bytes = [];
    for (var i = 0; i < str.length; ) {
        if (str[i] === '%') {
            i++;
            bytes.push(parseInt(str.substring(i, i + 2), 16));
            i += 2;
        } else {
            bytes.push(str.charCodeAt(i));
            i++;
        }
    }
    var buf = Buffer.from(bytes);
    return iconv.decode(buf, charset); // take urlencode(https://github.com/node-modules/urlencode) as reference
}
function charset_encodeURIComponent(str, charset) {
    if (
        !charset ||
        charset.toLowerCase() === 'utf8' ||
        charset.toLowerCase() === 'utf-8'
    )
        return encodeURIComponent(str); // take encodeURI.js(https://github.com/jonelf/encodeURI.js/blob/master/lib/encodeURI.js) as reference
    var buf = iconv.encode(str, charset);
    var list = [];
    for (var cc of buf.values()) {
        if (
            (97 <= cc && cc <= 122) || // a - z
            (65 <= cc && cc <= 90) || // A - Z
            (48 <= cc && cc <= 57) || // 0 - 9
            cc == 33 || // !
            (45 <= cc && cc <= 46) || // -.
            cc == 95 ||
            cc == 126 // _~  RFC5987 above
        ) {
            list.push(String.fromCharCode(cc));
        } else {
            var hex = cc.toString(16).toUpperCase();
            list.push('%' + (hex.length === 1 ? '0' + hex : hex));
        }
    }
    return list.join('');
}
function charset_decodeURIComponent(str, charset) {
    if (
        !charset ||
        charset.toLowerCase() === 'utf8' ||
        charset.toLowerCase() === 'utf-8'
    )
        return decodeURIComponent(str);
    if (!str.match(/%[a-zA-Z\d]{2}/)) return decodeURIComponent(str);
    var bytes = [];
    for (var i = 0; i < str.length; ) {
        if (str[i] === '%') {
            i++;
            bytes.push(parseInt(str.substring(i, i + 2), 16));
            i += 2;
        } else {
            bytes.push(str.charCodeAt(i));
            i++;
        }
    }
    var buf = Buffer.from(bytes);
    return iconv.decode(buf, charset); // take urlencode(https://github.com/node-modules/urlencode) as reference
}
