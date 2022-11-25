const MongoLib = require('../lib/mongo');
const GoogleService = require('./google');
const googleService = new GoogleService();
// const createArrayImg = require('./utils');

/**
 * Service for handle Posters
 */
class PostersService {
  /**
   * Create instance with the collection's name
   * and a database instance to use
   */
  constructor() {
    this.collection = 'posters';
    this.lib = new MongoLib();
  }

  /**
   *  Get all posters from database
   * @return {Promise<Array>} All the posters
   */
  async getPosters() {
    const posters = await this.lib.getAll(this.collection);

    return posters || [];
  }

  /**
   * Get one poster
   * @param {number} posterId
   * @return {Object}
   */
  async getPoster({posterId}) {
    const poster = await this.mongoDB.get(this.collection, posterId);
    return poster || {};
  }

  /**
   * Save posters in bucket
   * @param {Files} posters with some information
   * @return {Posters}
   */
  async createPosters(posters) {
    const promises = posters.map( async (poster) => {
      const tmp = await googleService.generateURl(poster);
      return tmp;
    });
    const publicUrls = await Promise.allSettled(promises);

    const newPosters = posters.map(
        (poster, i) => {
          const {originalname, mimetype, size} = poster;
          return {originalname, mimetype, size, publicUrl: publicUrls[i]};
        }
    );

    const savedPosters = await this.lib.insertMany('posters', newPosters);

    return savedPosters;
  }


  // async createPoster({posters}) {
  //   const arrayCreatedPosters = await this.createOrUpdate(null, posters);
  //   return arrayCreatedPosters || [];
  // }

  // async updatePoster({postersId, posters}) {
  //   const updatedPosterId = await this.createOrUpdate(postersId, posters);
  //   return updatedPosterId;
  // }

  // async createOrUpdate(postersId, posters) {
  //   let action = '';
  //   let data = [];
  //   if (postersId === null) {
  //     action = (collection, poster) =>
  // this.mongoDB.create(collection, poster);
  //     data = createArrayImg(null, posters);
  //   } else {
  //     action = (collection, poster) =>
  // this.mongoDB.update(collection, poster);
  //     data = createArrayImg(postersId, posters);
  //   }
  //   const results = await this.execAction(action, data);
  //   return results || [];
  // }

  // async execAction(action, data) {
  //   const promises = data.map(async (poster) => {
  //     const createdPosterId = await action(this.collection, poster);
  //     return createdPosterId;
  //   });
  //   const resolvedPromises = await Promise.all(promises);
  //   return resolvedPromises;
  // }

  // async deletePoster({postersId}) {
  //   const ids = postersId.split(',');
  //   const promises = ids.map(async (posterId) => {
  // const deletedPoster = await this.mongoDB.delete(this.collection, posterId);
  //     return deletedPoster;
  //   });

  //   const deletedPosterIds = await Promise.all(promises);

  //   return deletedPosterIds;
  // }

  // async deletePosters() {
  //   const deletedPosters = await this.mongoDB.deleteAll(this.collection);
  //   return deletedPosters;
  // }
}

module.exports = PostersService;
