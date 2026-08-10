/**
 * 為留言列表排序 / 分頁建立索引
 */
module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async up(db) {
    await db.collection('messages').createIndex({ createdAt: -1 })
  },

  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async down(db) {
    await db.collection('messages').dropIndex({ createdAt: -1 })
  }
};
