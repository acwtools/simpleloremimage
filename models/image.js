/*
 * simple lorem image (C) 2016 by Gandalf Sievers
 * Created by Gandalf Sievers on 26.05.16.
 *
 * MIT-License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @exports Image
 */

/**
 *  Image Class
 */
class Image {
  /**
   *
   * @param {object} dependencies Dependencies
   * @param {fs} dependencies.fs NodeJS FileSystem handler
   * @param {path} dependencies.path NodeJS Path handler
   * @param {imagemagick-stream} dependencies.imagemagick-stream imagemagick wrapper for NodeJS
   */
  constructor(dependencies) {
    if (dependencies.fs) {
      /**
       * @type {fs} filesystem
       */
      this.fs = dependencies.fs;
    } else {
      throw new Error('Required dependency fs not set');
    }
    if (dependencies.path) {
      /**
       * @type {path} Path
       */
      this.path = dependencies.path;
    } else {
      throw new Error('Required dependency path not set');
    }
    if (dependencies['imagemagick-stream']) {
      /**
       * @type {imagemagick-stream} Image-Magick
       */
      this.im = dependencies['imagemagick-stream'];
    } else {
      throw new Error('Required dependency imagemagick-stream not set');
    }
  }

  /**
   * Get a random image from the source directory
   * @param {string} subject string to filter the images in the source directory
   * @returns {Promise} Promise wrapping file-list
   */
  getRandomImage(subject = '') {
    return new Promise((resolve, reject) => {
      this.fs.readdir(this.path.join(__dirname, '/../source_images'), (err, files) => {
        if (err) {
          reject('dir reading error');
        } else {
          let imageFiles = files.filter(name => name[0] !== '.');
          if (imageFiles.length > 0) {
            if (subject !== '') {
              const matching = imageFiles.filter(name => name.includes(subject));
              if (matching.length > 0) {
                imageFiles = matching;
              }
            }
            /* If more then one file, shuffle files */
            if (imageFiles.length > 1) {
              let i;
              let j = 0;
              let temp = null;

              for (i = imageFiles.length - 1; i > 0; i -= 1) {
                j = Math.floor(Math.random() * (i + 1));
                temp = imageFiles[i];
                imageFiles[i] = imageFiles[j];
                imageFiles[j] = temp;
              }
            }
            resolve(imageFiles[0]);
          } else {
            reject('dir empty');
          }
        }
      });
    });
  }

  /**
   * Look up an image via getRandomImage(subject) and resize it.
   * Return path to the image.
   * @param {number} x width of the desired image
   * @param {number} y height of the desired image
   * @param {string} subject string to filter the images
   * @returns {Promise} Promise wrapping image name
   */
  getImage(x, y, subject = '') {
    return new Promise((resolve, reject) => {
      this.getRandomImage(subject).then((imageFile) => {
        const extension = imageFile.match(/\.\w+$/);
        const baseName = imageFile.replace(extension, '');
        const inputFile = this.path.join(__dirname, '/../source_images/', imageFile);
        const outputName = `${baseName}-${x}_${y}${extension}`;
        const outputLocation = this.path.join('/loremimages/', outputName);
        const outputFile = this.path.join(__dirname, '/../public/', outputLocation);

        const read = this.fs.createReadStream(inputFile);
        read.on('error', () => {
          reject('image does not exist');
        });
        read.on('open', () => {
          const write = this.fs.createWriteStream(outputFile, { flags: 'wx' });
          /* Fail when file exists */
          write.on('error', (err) => {
            if (err.code === 'EEXIST') {
              /* File is already converted, we are good */
              resolve(outputLocation);
            } else {
              reject(err);
            }
          });
          write.on('open', () => {
            const resize = this.im().resize(`${x}x${y}!`).quality(90);
            read.pipe(resize).pipe(write);
          });
          write.on('finish', () => {
            resolve(outputLocation);
          });
        });
      },
      (reason) => {
        reject(reason);
      }).catch((reason) => {
        reject(reason);
      });
    });
  }
}

module.exports = Image;
exports = module.exports;
