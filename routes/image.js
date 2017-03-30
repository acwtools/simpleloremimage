const express = require('express');
const Image = require('./../models/image');
const fs = require('fs');
const path = require('path');
const im = require('imagemagick-stream');

const router = express.Router();

const handler = new Image({
  fs,
  path,
  'imagemagick-stream': im,
});

/* GET Image. */
router.get('/:width/:height/:type?', (req, res, next) => {
  const width = req.params.width;
  const height = req.params.height;
  const type = req.params.type;

  handler.getImage(width, height, type).then((fileName) => {
    res.redirect(302, fileName);
  }, (reason) => {
    console.log('Reason: %s', reason); // eslint-disable-line no-console
    next();
  }).catch(next);
});

module.exports = router;
