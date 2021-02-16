/*
 * Author:wistn
 * since:2019-09-19
 * LastEditors:Do not edit
 * LastEditTime:2020-06-05
 * Description:
 */
var SdAttributeList = require('./org_noear_sited_SdAttributeList');
var SdNode = require('./org_noear_sited_SdNode');
var TextUtils = require('./mytool').TextUtils;
class DdNode extends SdNode {
    s() {
        return this.source;
    }

    constructor(source) {
        super(source);
        // 是否支持全部下载(book[1,2,3])
        this.donwAll = true;
        // 是否显示导航能力（用于：section[1,2,3]）;即上一章下一章;
        this.showNav = true;
        // 是否显示图片（null：默认；0：不显示；1：显示小图；2：显示大图）
        this.showImg = null;
        // 是否自适应大小（基于pad 或 phone 显示不同的大小）
        this.autoSize = false;
        // 是否显示S按钮
        this.showWeb = true;
        // 屏幕方向（v/h）
        this.screen = null;
        // 首页图片显示的宽高比例
        this.WHp = 0;
        // 是否循环播放
        this.loop = false;
        // 样式风格
        this.style = 0;
        // 预设选项
        this.options = null;
        this._web = null;
    }
    // @Override
    OnDidInit() {
        this.donwAll = this.attrs.getInt('donwAll', 1) > 0;
        this.showNav = this.attrs.getInt('showNav', 1) > 0;
        this.showImg = this.attrs.getString('showImg');
        this.autoSize = this.attrs.getInt('autoSize', 0) > 0;
        this.showWeb =
            this.attrs.getInt('showWeb', this.s().isPrivate() ? 0 : 1) > 0; // isPrivate时，默认不显示；否则默认显示
        this.screen = this.attrs.getString('screen');
        this.loop = this.attrs.getInt('loop', 0) > 0;
        this._web = this.attrs.getValue('web'); // 控制外部浏览器的打开
        if (this.source.schema < 2) {
            this._web.build = this.attrs.getString('buildWeb');
        }
        this.options = this.attrs.getString('options');
        this.style = this.attrs.getInt('style', DdNode.STYLE_VIDEO);
        if (
            TextUtils.isEmpty(this.screen) &&
            this.style == DdNode.STYLE_AUDIO
        ) {
            this.screen = 'v';
        }
        let w = this.attrs.getString('w');
        if (TextUtils.isEmpty(w) == false) {
            let h = this.attrs.getString('h');
            this.WHp = parseFloat(w) / parseFloat(h);
        }
    }
    // 是否内部WEB运行
    isWebrun() {
        let run = this.attrs.getString('run');
        if (run == null) return false;
        return run.indexOf('web') >= 0;
    }
    // 是否外部WEB运行
    isOutWebrun() {
        let run = this.attrs.getString('run');
        if (run == null) return false;
        return run.indexOf('outweb') >= 0;
    }
    getWebUrl(url) {
        let atts = new SdAttributeList();
        atts.set('url', url);
        return this._web.run(this.source, atts, url);
    }
}
DdNode.STYLE_VIDEO = 11;
DdNode.STYLE_AUDIO = 12;
DdNode.STYLE_INWEB = 13;
exports = module.exports = DdNode;
