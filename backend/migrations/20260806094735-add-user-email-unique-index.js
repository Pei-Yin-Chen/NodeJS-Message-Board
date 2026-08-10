/**
 * 確保 email 在資料庫層級唯一
 * 若已有重複 email，up 會失敗，需先手動清理資料
 */
module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async up(db) {
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
  },

  /**
   * @param db {import('mongodb').Db}
   * @returns {Promise<void>}
   */
  async down(db) {
    await db.collection('users').dropIndex({ email: 1 })
  }
};
