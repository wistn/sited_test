/*
 * Author:wistn
 * since:2019-12-17
 * LastEditors:Do not edit
 * LastEditTime:2020-04-07
 * Description:
 */
class DbApi {
    static isFaved(book) {
        return false;
    }

    static logBID(source, bookKey, bookUrl) {
        // if (
        //     db.existsSQL('SELECT * FROM books WHERE bkey=?', bookKey) == false
        // ) {
        //     db.updateSQL(
        //         'INSERT INTO books(bkey,url,source) VALUES(?,?,?);',
        //         bookKey,
        //         bookUrl,
        //         source
        //     );
        // }
    }

    static getBID(bookKey) {
        // let bid = 0;
        // let dr = db.selectSQL('SELECT id FROM books WHERE bkey=?;', bookKey);
        // if (dr.read()) {
        //     bid = dr.getInt('id');
        // }
        // dr.close();
        // return bid;
    }
}
exports = module.exports = DbApi;
