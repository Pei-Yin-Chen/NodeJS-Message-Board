require('dotenv').config()

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
}
