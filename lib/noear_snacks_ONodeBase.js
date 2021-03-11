/*
 * Author:wistn
 * since:2021-03-02
 * LastEditors:Do not edit
 * LastEditTime:2021-03-04
 * Description:对Java类 noear.snacks.ONodeBase 的简单移植： tryLoad asArray isArray isObject 方法
 */
exports = module.exports = require('./noear_snacks').ONodeBase;
// 这样处理避免循环依赖
