/*
 * Author:wistn
 * since:2019-12-21
 * LastEditors:Do not edit
 * LastEditTime:2021-03-03
 * Description:
 */
var BookSearchModel = require('./org_noear_siteder_models_BookSearchModel');
var ViewModelBase = require('./org_noear_siteder_viewModels_ViewModelBase');
var ONode = require('./noear_snacks_ONode');
class SearchSdViewModel extends ViewModelBase {
    // @Override
    loadByConfig(c) {
        let config = c;

        if (this.doFilter(c.title)) {
            return;
        }
        var b = new BookSearchModel();

        let cfg = config.s().search;

        b._dtype = cfg.dtype();
        b.btype = cfg.btype();
        b.name = c.title;
        b.url = c.url.value;
        b.logo = c.logo;
        b.updateTime = '';
        b.newSection = '';
        b.author = '';
        b.status = '';
        b.source = config.source.title;

        this.doAddItem(b);
    }

    // @Override
    loadByJson(c, ...jsons) {
        // java版: (String... jsons) 表示可变长度参数列表，参数为0到多个String类型的对象，或者是一个String[]。
        if (jsons == null || jsons.length == 0) return;
        let config = c;
        // js版: (...jsons) 表示剩余参数组成的真数组，要Array.isArray(jsons[0])识别java版的多个String或者一个String[]
        if (jsons.length == 1 && Array.isArray(jsons[0])) {
            jsons = jsons[0];
        }
        for (let json of jsons) {
            // 支持多个数据块加载
            let data = ONode.tryLoad(json);
            if (data.isArray()) {
                for (let n of data) {
                    let name = n.get('name').getString();
                    if (this.doFilter(name)) {
                        continue;
                    }
                    var b = new BookSearchModel();
                    b.name = name;
                    b.url = n.get('url').getString();
                    b.logo = n.get('logo').getString();
                    b.updateTime = n.get('updateTime').getString();
                    b.newSection = n.get('newSection').getString();
                    b.author = n.get('author').getString();
                    b.status = n.get('status').getString();
                    b.source = config.source.title;
                    b.btag = n.get('btag').getString();
                    let cfg = config.s().book(b.url); // 类型DdNode
                    b._dtype = cfg.dtype();
                    b.btype = cfg.btype();
                    this.doAddItem(b);
                }
            }
        }
    }
    doFilter(name) {}
    doAddItem(item) {}

    clear() {}
    total() {}
}
exports = module.exports = SearchSdViewModel;
