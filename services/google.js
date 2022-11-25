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
   * @return {url}
   */
  async generateURl(file) {
    const publicUrl = await this.#save(file);
    return publicUrl;
  }
}

module.exports = GoogleService;
