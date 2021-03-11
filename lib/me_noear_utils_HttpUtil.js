/*
 * Author:wistn
 * since:2019-12-17
 * LastEditors:Do not edit
 * LastEditTime:2021-03-01
 * Description: HTTP 工具
 */
var axios = require('axios');
var qs = require('qs');
class HttpUtil {
    /* 发起get请求，并返回String结果*/
    static async get() {
        switch (arguments.length) {
            case 2: {
                let url = arguments[0],
                    callback = arguments[1];
                await this.get(url, null, callback);
                break;
            }
            case 3: {
                let url = arguments[0],
                    params = arguments[1],
                    callback = arguments[2];
                await this.get(null, url, params, callback);
                break;
            }
            case 4: {
                let header = arguments[0],
                    url = arguments[1],
                    params = arguments[2],
                    callback = arguments[3];
                let getData = {};
                if (params != null) {
                    for (let [k, v] of params.entries()) {
                        getData[k] = v;
                    }
                    url = url.replace(/\?$/, '') + '?' + qs.stringify(getData);
                }
                var options = {
                    maxRedirects: 5,
                    responseType: 'text',
                    transformResponse: (data) => data
                };
                if (header != null && header.size > 0) {
                    for (let key of header.keys()) {
                        options.headers[
                            encodeURIComponent(key)
                        ] = encodeURIComponent(header.get(key));
                    }
                }
                // java版 AsyncHttpClient.get的null是android.content.Context
                try {
                    let res = await axios.get(encodeURI(url), options);
                    let s = res.data;
                    if (s == null) callback(-1, s);
                    else callback(1, s);
                } catch (error) {
                    callback(-2, null);
                }
                break;
            }
        }
    }
    /* 发起post请求，并返回String结果*/
    static async post(url, params, callback) {
        var postData = {};
        for (let [key, value] of params.entries()) {
            postData[key] = value;
        }
        var options = {
            'Content-type': 'application/x-www-form-urlencoded',
            'maxRedirects': 5,
            'responseType': 'text',
            'transformResponse': (data) => data
        };
        // java版 AsyncHttpClient.post的null是android.content.Context
        try {
            let res = await axios.post(url, qs.stringify(postData), options);
            let s = res.data;
            if (s == null) callback(-1, s);
            else callback(1, s);
        } catch (error) {
            callback(-2, null);
        }
    }
}
exports = module.exports = HttpUtil;
