/*
 * Author:wistn
 * since:2019-12-17
 * LastEditors:Do not edit
 * LastEditTime:2020-04-10
 * Description:HTTP 工具
 */
var axios = require('axios');
class HttpUtil {
    /* 发起get请求，并返回String结果*/
    static get() {
        switch (arguments.length) {
            case 2: {
                let url = arguments[0],
                    callback = arguments[1];
                this.get(url, null, callback);
                break;
            }
            case 3: {
                let url = arguments[0],
                    params = arguments[1],
                    callback = arguments[2];
                this.get(null, url, params, callback);
                break;
            }
            case 4: {
                let header = arguments[0],
                    url = arguments[1],
                    params = arguments[2],
                    callback = arguments[3];
                let getData = '';
                if (params != null) {
                    for (let [k, v] of params.entries()) {
                        getData += k + '=' + v + '&';
                    }
                    url =
                        url.replace(/\?$/, '') +
                        '?' +
                        getData.replace(/&$/, '');
                }
                let options = {};
                if (header != null && header.size > 0) {
                    for (let key of header.keys()) {
                        options.headers[key] = header.get(key);
                    }
                }
                // java版 AsyncHttpClient.get的null是android.content.Context
                axios
                    .get(encodeURI(url))
                    .then((res) => {
                        let s = res.data;
                        if (s == null) callback(-1, s);
                        else callback(1, s);
                    })
                    .catch((error) => {
                        callback(-2, null);
                    });
                break;
            }
        }
    }
    /* 发起post请求，并返回String结果*/
    static post(url, params, callback) {
        var postData = {};
        for (let [key, value] of params.entries()) {
            postData[key] = value;
        }
        // java版 AsyncHttpClient.post的null是android.content.Context
        axios
            .post(url, postData)
            .then((res) => {
                let s = res.data;
                if (s == null) callback(-1, s);
                else callback(1, s);
            })
            .catch((error) => {
                callback(-2, null);
            });
    }
}
exports = module.exports = HttpUtil;
