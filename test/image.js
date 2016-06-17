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

var Image = require('../models/image');
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
var sinon = require('sinon');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe('Image', function () {
    context('fs not injected in constructor', function(){
        it('should throw an exception "Required dependency fs not set"', function () {
            return expect(function(){ new Image({'imagemagick-stream' : {}})}).to.throw('Required dependency fs not set');
        });
    });
    context('imagemagick-stream not injected in constructor', function(){
        it('should throw an exception "Required dependency imagemagick-stream not set"', function () {
            return expect(function(){ new Image({'fs' : {}})}).to.throw('Required dependency imagemagick-stream not set');
        });
    });

    describe('getRandomImage', function () {
        context('dir not readable with fs', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, true)
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should reject with "dir reading error"', function () {
                return image.getRandomImage('test').should.be.rejectedWith('dir reading error');
            });
        });
        context('dir empty', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, [])
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should reject with "dir empty"', function () {
                return image.getRandomImage('test').should.be.rejectedWith('dir empty');
            });
        });
        context('dir contains file "test.png"', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ["test.png"])
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should return test.png"', function () {
                return image.getRandomImage('test').should.eventually.equal('test.png');
            });
        });
        context('dir contains files "aaa.png", "bbb.png", "ccc.png", subject is "bb"', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ["aaa.png", "bbb.png", "ccc.png"])
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should always return bbb.png"', function () {
                return image.getRandomImage('bb').should.eventually.equal('bbb.png');
            });
        });
        context('dir contains files "aaa.png", "bbb.png", "ccc.png", subject is "dd", function()', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ["aaa.png", "bbb.png", "ccc.png"])
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should return one of "aaa.png", "bbb.png", "ccc.png" randomly', function () {
                return image.getRandomImage('dd').should.eventually.to.be.oneOf(["aaa.png", "bbb.png", "ccc.png"]);
            });
        });
        context('dir contains files "ddd.png", "eee.png", "fff.png", subject is "", function()', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ["ddd.png", "eee.png", "fff.png"])
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should return one of "aaa.png", "bbb.png", "ccc.png" randomly', function () {
                return image.getRandomImage('').should.eventually.to.be.oneOf(["ddd.png", "bbb.png", "fff.png"]);
            });
        });
        context('dir contains files "test-aaa.png", "test-bbbxxx.png", "testbbc-123.png", "444ccc.png", "ddd.png" subject is "bb"', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ["test-aaa.png", "test-bbbxxx.png", "testbbc-123.png", "444ccc.png"])
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should return one of "test-bbbxxx.png", "testbbc-123.png" randomly', function () {
                return image.getRandomImage('bb').should.eventually.to.be.oneOf(["test-bbbxxx.png", "testbbc-123.png"]);
            });
        });
    });
    describe('getImage', function () {
        context('error in getRandomImage ', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, {'err' : 'test'}, null)
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should reject with forwarding error', function () {
                return image.getImage(2, 3, 'testsasfa').should.be.rejectedWith('dir reading error');
            });
        });
        context('no image from getRandomImage ', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, [])
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should reject with "dir empty"', function () {
                return image.getImage(2, 3, 'test').should.be.rejectedWith("dir empty");
            });
        });
        context('image file is not readable', function () {
            var image;
            before(function () {
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ['test444.png']),
                        'createReadStream': sinon.stub().returns({
                            'on': sinon.stub().withArgs('error').callsArg(1)
                        })
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should reject with "image does not exist"', function () {
                return image.getImage(2, 3, 'test').should.be.rejectedWith("image does not exist");
            });
        });
        context('output image does exist', function () {
            var image;
            before(function () {
                var createReadStreamOn = sinon.stub();
                createReadStreamOn.withArgs('open').callsArg(1);
                createReadStreamOn.withArgs('error').returns(true);
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ['test444.png']),
                        'createReadStream': sinon.stub().returns({
                            'on': createReadStreamOn
                        }),
                        'createWriteStream': sinon.stub().returns({
                            'on': sinon.stub().withArgs('error').callsArgWith(1, {'code': 'EEXIST'})
                        })
                    },
                    'imagemagick-stream': require('imagemagick-stream')
                });
            });
            it('should resolve with inputfile name changed to outputfile name', function () {
                return image.getImage(2, 3, 'test').should.eventually.equal('/loremimages/test444-2_3.png');
            });
        });
        context('is not createable', function () {
            var image;
            before(function () {
                var createReadStreamOn = sinon.stub();
                createReadStreamOn.withArgs('open').callsArg(1);
                createReadStreamOn.withArgs('error').returns(true);
                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ['test444.png']),
                        'createReadStream': sinon.stub().returns({
                            'on': createReadStreamOn
                        }),
                        'createWriteStream': sinon.stub().returns({
                            'on': sinon.stub().withArgs('error').callsArgWith(1, {'code': 'forwarded'})
                        })
                    },
                    'imagemagick-stream': sinon.expectation.create('imagemagick-stream').never()
                });
            });
            it('should reject with forwarding error', function () {
                return image.getImage(2, 3, 'test').should.be.rejectedWith({'code': 'forwarded'});
            });
        });
        context('image does not exist and is createable', function () {
            var image;
            var imagemagick;
            var resize;
            var quality;
            var pipe;
            var im;
            beforeEach(function () {
                var createReadStreamOn = sinon.stub();
                createReadStreamOn.withArgs('open').callsArg(1);
                createReadStreamOn.withArgs('error').returns(true);
                var createWriteStream = sinon.stub();
                createWriteStream.withArgs('error').returns(true);
                createWriteStream.withArgs('open').callsArg(1);
                createWriteStream.withArgs('finish').callsArg(1);

                pipe = sinon.expectation.create('resize').once().returns({
                    'resize': resize,
                    'quality': quality,
                    'pipe': pipe
                });
                quality = sinon.expectation.create('quality').once().returns({
                    'resize': resize,
                    'quality': quality,
                    'pipe': pipe
                });
                resize = sinon.expectation.create('resize').once().returns({
                    'resize': resize,
                    'quality': quality,
                    'pipe': pipe
                });
                imagemagick = {
                    'resize': resize,
                    'quality': quality,
                    'pipe': pipe
                };
                im = sinon.stub().returns(imagemagick);


                image = new Image({
                    'fs': {
                        'readdir': sinon.stub().callsArgWith(1, null, ['test444.png']),
                        'createReadStream': sinon.stub().returns({
                            'on': createReadStreamOn,
                            'pipe': sinon.stub().returns({
                                    'pipe': sinon.stub()
                                }
                            )
                        }),
                        'createWriteStream': sinon.stub().returns({
                            'on': createWriteStream
                        })
                    },
                    'imagemagick-stream': im
                });
            });
            it('should call image creator', function () {
                return image.getImage(5, 3, 'test').should.eventually.equal('/loremimages/test444-5_3.png');
            });
            after(function () {
                resize.verify();
            });
            it('should resolve with inputfile name changed to outputfile name', function () {
                return image.getImage(5, 3, 'test').should.eventually.equal('/loremimages/test444-5_3.png');
            });
        });
    });
});
