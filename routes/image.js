var express = require('express');
var image = require('./../models/image');
var fs = require('fs');
var im = require('imagemagick-stream');
var router = express.Router();


var handler = new image({
    'fs' : fs,
    'imagemagick-stream' : im
});
/* GET Image. */
router.get('/:width/:height/:type?', function(req, res, next) {
    var width = req.params.width;
    var height = req.params.height;
    var type = req.params.type;
    
    handler.getImage(width, height, type).then(function (fileName) {
        res.redirect(302, fileName);
    }, function (reason) {
        console.log('Reason: %s', reason);
        next();
    }).catch(next);

});

module.exports = router;
