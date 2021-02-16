/*
 * Author:wistn
 * since:2019-09-16
 * LastEditors:Do not edit
 * LastEditTime:2020-06-05
 * Description:
 */
class SdNodeSet {
    release() {
        this._items = [];
    }
    // ---------------
    constructor(s) {
        this._items = [];
        this.source = null;
        this._dtype = 0;
        // 数据类型
        this._btype = 0;
        this.name = null;
        this.attrs = new SdAttributeList();
        this.source = s;
    }
    OnDidInit() {}
    dtype() {
        if (this._dtype > 0) return this._dtype;
        else return 1;
    }
    btype() {
        if (this._btype > 0) return this._btype;
        else return this.dtype();
    }
    nodeType() {
        return 2;
    }
    nodeName() {
        return this.name;
    }
    // @Override
    isEmpty() {
        return this._items.length == 0;
    }
    buildForNode(element) {
        if (element == null) return this;
        element = element.nodeType ? element : element[0]; // 把cheerio(元素名)变为cheerio(元素名)[0]，不像java做Node Element转换
        this.name = element.tagName;

        this._items = [];
        this.attrs.clear();
        {
            let temp = new Map(Object.entries(element.attribs)); // cheerio(元素名).attr()即cheerio(元素名)[0].attribs返回没有长度的对象或者{}
            for (let [key, value] of temp) {
                this.attrs.set(key, value); // 存储标签元素的属性
            }
        }
        {
            let temp = element.children;
            for (let i = 0, len = temp.length; i < len; i++) {
                var p = temp[i];
                if (
                    p.nodeType == 1 &&
                    Object.keys(p.attribs).length == 0 &&
                    p.children
                ) {
                    if (p.children.length == 1) {
                        var p2 = p.children[0];
                        if (p2.nodeType == 3) {
                            // 说明element的子节点p是<title>xxx</title>这种元素类型
                            this.attrs.set(p.tagName, p2.data);
                        }
                    }
                }
            }
        }
        this._dtype = this.attrs.getInt('dtype');
        this._btype = this.attrs.getInt('btype');
        var xList = element.children;
        for (let i = 0, len = xList.length; i < len; i++) {
            var n1 = xList[i];
            if (n1.nodeType == 1) {
                // Element是Node的真子集 Element e1 = (Element) n1;
                var e1 = n1;
                var tagName = e1.tagName;
                if (Object.keys(e1.attribs).length) {
                    // 说明element的子节点e1是Node类型例如<hots xxx />、<tags title=yyy><item /></tags>。temp是DdNode不用如java版向上向下转型
                    let temp = SdApi.createNode(
                        this.source,
                        tagName
                    ).buildForNode(e1);
                    this.add(temp);
                } else if (e1.children && e1.children.length > 1) {
                    // java版e1.getChildNodes().getLength()>1，说明element的子节点e1是NodeSet类型如<home>，标签之间要有文本节点(即换行、空白)不然<book><book xxx /></book>不会大于1就不能识别为NodeSet。tags不会是NodeSet因为含有title属性占位。temp是DdNodeSet不用如java版向上向下转型
                    let temp = SdApi.createNodeSet(
                        this.source,
                        tagName
                    ).buildForNode(e1);
                    this.add(temp);
                }
            }
        }
        this.OnDidInit();
        return this;
    }
    nodes() {
        return this._items;
    }
    get(name) {
        for (let n of this._items) {
            if (name == n.nodeName()) return n;
        }
        return SdApi.createNode(this.source, name).buildForNode(null);
    }
    nodeMatch(url) {
        for (let n of this._items) {
            var n1 = n;
            if (n1.isMatch(url)) {
                Log.v('nodeMatch.select', n1.expr);
                return n1;
            }
        }
        return SdApi.createNode(this.source, null).buildForNode(null);
    }
    add(node) {
        this._items.push(node);
    }
}
exports = module.exports = SdNodeSet;
var SdAttributeList = require('./org_noear_sited_SdAttributeList');
var Log = require('./android_util_Log');
var SdApi = require('./org_noear_sited_SdApi');
