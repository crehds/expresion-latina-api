// require('dotenv').config({path: './server/.env'});
require('dotenv').config();


const GLOBAL_CONFIG = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 4000,
  CORS: process.env.CORS
};

const CONFIG_MYSQL = {
  dbUserMysql: process.env.DB_USER_MYSQL,
  dbPasswordMysql: process.env.DB_PASSWORD_MYSQL,
  dbHostMysql: process.env.DB_HOST_MYSQL,
  dbNameDBMysql: process.env.DB_NAME_MYSQL
};

const CONFIG_MONGO = {
  dbUserMongo: process.env.DB_USER_MONGO,
  dbPasswordMongo: process.env.DB_PASSWORD_MONGO,
  dbHostMongo: process.env.DB_HOST_MONGO,
  dbNameDBMongo: process.env.DB_NAME_MONGO
};

const GCLOUD = {
  bucket: process.env.GCLOUD_BUCKET,
};

module.exports = {GLOBAL_CONFIG, CONFIG_MYSQL, CONFIG_MONGO, GCLOUD};
