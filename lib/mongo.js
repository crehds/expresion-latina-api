/* eslint-disable require-jsdoc */
const {CONFIG_MONGO} = require('../config');
const {MongoClient, ObjectId, GridFSBucket} = require('mongodb');
const debug = require('debug')('app:mongodb');
const fs = require('fs');
const assert = require('assert');
const USER = encodeURIComponent(CONFIG_MONGO.dbUserMongo);
const PASSWORD = encodeURIComponent(CONFIG_MONGO.dbPasswordMongo);
const DB_NAME = CONFIG_MONGO.dbNameDBMongo;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${CONFIG_MONGO.dbHostMongo}/${CONFIG_MONGO.dbNameDBMongo}?retryWrites=true&w=majority`;

// const {PassThrough} = require('stream');

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbName = DB_NAME;
  }

  async #connect() {
    if (!MongoLib.connection) {
      await this.client.connect();
      MongoLib.connection = this.client.db(this.dbName);
      return MongoLib.connection;
    }
    return MongoLib.connection;
  }

  async getAll(collection) {
    const db = await this.#connect();
    const result = await db.collection(collection).find({}).toArray();

    return result;
  }

  get(collection, id) {
    return this.connect().then((db) => {
      return db
          .collection(`${collection}.files`)
          .findOne({_id: ObjectId(id)});
    });
  }


  async insertMany(collection, data) {
    const db = await this.#connect();
    const result = await db.collection(collection).insertMany(data);
    return result;
  }

  // create(collection, poster) {
  //   return this.connect()
  //     .then((db) => {
  //       let posterCollection = new GridFSBucket(db, {
  //         bucketName: collection,
  //       });
  //       return fs
  //         .createReadStream(poster.path)
  //         .pipe(posterCollection.openUploadStream("portada2"))
  //         .on("error", function (error) {
  //           if (error) assert.ifError(error);
  //         })
  //         .on("finish", function () {
  //           debug("done!");
  //         });
  //     })
  //     .then((result) => result);
  // }

  create(collection, posters) {
    return posters.map((poster) => {
      const filename = this.connect()
          .then((db) => {
            const posterCollection = new GridFSBucket(db, {
              bucketName: collection,
            });
            return fs
                .createReadStream(poster.path)
                .pipe(posterCollection.openUploadStream('portada2'))
                .on('error', function(error) {
                  if (error) assert.ifError(error);
                })
                .on('finish', function() {
                  debug('done!');
                });
          })
          .then((result) => {
            return result.filename;
          });
      return filename;
    });
  }

  // update(collection, id, data) {
  //   return this.connect()
  //       .then((db) => {
  //         return db
  //             .collection(collection)
  //             .updateOne({_id: ObjectId(id)}, {$set: data}, {upsert: true});
  //       })
  //       .then((result) => result.upsertedId || id);
  // }

  // delete(collection, id) {
  //   return this.connect()
  //       .then((db) => {
  //         const bucket = new GridFSBucket(db, {bucketName: collection});
  //         return bucket.delete(ObjectId(id), (error) => {
  //           if (error) {
  //             debug('error on deleting...');
  //             assert.ifError(error);
  //           }
  //         });
  //       })
  //       .then(() => id);
  // }

  // deleteAll(collection) {
  //   return this.connect()
  //       .then((db) => {
  //         const bucket = new GridFSBucket(db, {bucketName: collection});
  //         return bucket
  //             .drop((error) => {
  //               if (error) {
  //                 debug('error on dropping...');
  //                 assert.ifError(error);
  //               }
  //               debug('posters deleted');
  //             })
  //             .then(() => {
  //     const files = db.collection(`${collection}.files`).find().toArray();
  //     const chunks = db.colletion(`${collection}.chunks`).find().toArray();
  //               return {files, chunks};
  //             });
  //       })
  //       .then((result) => {
  //         console.log(result);
  //         return result ?
  //         {files: result.files, chunks: result.chunks} :
  //         `Something getting wrong`;
  //       });
  // }
}

module.exports = MongoLib;
