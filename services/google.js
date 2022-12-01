const {Storage} = require('@google-cloud/storage');
const {GCLOUD} = require('../config');
const GCLOUD_BUCKET = GCLOUD.bucket;

/**
 * Service for handle Google Platform
 */
class GoogleService {
  /**
   * Create a new storage
   */
  constructor() {
    this.storage = new Storage({
      keyFilename: './json/google.json'
    });
  }

  /**
   * @private
   * Save image in Google Cloud
   * @param {file} file with any extension
   * @return {url}
   */
  #save(file) {
    return new Promise((resolve, reject) => {
      const {originalname, buffer} = file;
      const bucket = this.storage.bucket(GCLOUD_BUCKET);
      const blob = bucket.file(originalname.replace(/ /g, '_'));
      const blobStream = blob.createWriteStream({
        resumable: false
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      }).on('error', () => {
        reject(new Error(`Unable to upload image, something went wrong`));
      }).end(buffer);
    });
  }

  /**
   * Generate a  public url for the file
   * @param {file} file with any extension
   * @return {Promise<url>}
   */
  async generateURI(file) {
    const publicUrl = await this.#save(file);
    return publicUrl;
  }

  /**
   * Generate many publics url for files
   * @param {files} files with an image
   * @return {Promise<Array<uri>>} public urls
   */
  async generateManyURI(files) {
    const promises = files.map( async (poster) => {
      const tmp = await this.generateURI(poster);
      return tmp;
    });

    const publicUrls = await Promise.allSettled(promises);

    return publicUrls;
  }
}

module.exports = GoogleService;
