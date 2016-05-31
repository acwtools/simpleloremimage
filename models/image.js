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

"use strict";

class Image {
    constructor(settings) {
        if (settings.fs) {
            this.fs = settings.fs;
        }
        else {
            throw new Exception('Need fs');
        }
        if (settings['imagemagick-stream']) {
            this.im = settings['imagemagick-stream'];
        }
    }

    getRandomImage(subject = '') {
        return new Promise((resolve, reject) => {
            this.fs.readdir(__dirname + '/../source_images', function (err, files) {
                if (err) {
                    reject('dir reading error');
                }
                else {
                    files = files.filter((name) => {
                        return name[0] != '.';
                    });
                    if (files.length > 0) {
                        if (subject != '') {
                            let matching = files.filter((name) => {
                                return name.includes(subject);
                            });
                            if (matching.length > 0) {
                                files = matching;
                            }
                        }
                        /* If more then one file, shuffle files */
                        if (files.length > 1) {
                            let i = 0, j = 0, temp = null;

                            for (i = files.length - 1; i > 0; i -= 1) {
                                j = Math.floor(Math.random() * (i + 1));
                                temp = files[i];
                                files[i] = files[j];
                                files[j] = temp;
                            }
                        }
                        resolve(files[0]);
                    }
                    else {
                        reject('dir empty');
                    }
                }
            });
        });
    };

    getImage(x, y, subject = '') {
        return new Promise((resolve, reject) => {
            var imageFile = this.getRandomImage(subject).then((imageFile) => {

                    let extension = imageFile.match(/\.\w+$/);
                    let baseName = imageFile.replace(extension, '');
                    var inputFile = __dirname + '/../source_images/' + imageFile;
                    var outputName = '/loremimages/' + baseName + '-' + x + '_' + y + extension;
                    var outputFile = __dirname + '/../public/' + outputName;

                    var read = this.fs.createReadStream(inputFile);
                    read.on('error', () => {
                        reject('image does not exist');
                    });
                    read.on('open', () => {
                        var write = this.fs.createWriteStream(outputFile, {'flags': 'wx'});
                        /* Fail when file exists */
                        write.on('error', (err) => {
                            if (err.code == 'EEXIST') {
                                /* File is already converted, we are good */
                                resolve(outputName);
                            }
                            else {
                                reject(err);
                            }
                        });
                        write.on('open', () => {
                            const resize = this.im().resize(x + 'x' + y + '!').quality(90);
                            read.pipe(resize).pipe(write);
                        });
                        write.on('finish', () => {
                            resolve(outputName);
                        })
                    });
                },
                (reason) => {
                    reject(reason);
                }).catch(function (reason) {
                reject(reason);
            });
        });
    }
}

exports = module.exports = Image;