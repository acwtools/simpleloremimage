[![Build Status](https://travis-ci.org/acwtools/simpleloremimage.svg?branch=master)](https://travis-ci.org/acwtools/simpleloremimage)
[![Coverage Status](https://coveralls.io/repos/github/acwtools/simpleloremimage/badge.svg?branch=master)](https://coveralls.io/github/acwtools/simpleloremimage?branch=master)


# simple lorem image

## Installation and Usage
### Prerequisites
* Node.js Version 6+
* Image-Magick

### Setup
* Clone repository from github

      $ git clone https://github.com/acwtools/simpleloremimage
* Install dependencies via npm

      $ cd simpleloremimage && npm install
* copy your image files to source_image directory
* run server

      $ npm start
### Use
* make sure you have images in source_image directory

      $ cd simpleloremimage
      $ ls
        beach.png city.png city2.png city3.png sports.png sports2.png
* call server with desired image size and limit result set with topic parameter

      http://localhost:3000/:width/:height/:topic?
  Examples

      $ curl http://localhost:3000/320/250/city

      <img src="http://localhost:3000/640/480/city" width="640" height="480" alt="Simple Lorem Image" />

This example would return only images with the string "city" in their names.

## Features
* Filters images in source directory by topic
* Shuffles the resulting list
* Any scaled image is resized just once
* Redirects to the static path of the resulting image
* Images are cacheable in browser

## Known issues
* The app is as simple as possible
* Requires Node.js 6
* There is no security at all, see below
* There is no support for uploading images but can be archived with any third party image upload or (s)ftp tool
* There is no support for subdirectories
* The app might get slow with lots of images

## Security
* There is no security at all and there won't be in a foreseeable future, so use with care!
* The app is intended for local development only, behind a firewall or in a virtual machine
* Anyone could create as many sizes of each image as possible, flooding your hdd

## Why
* Existing online services did not satisfy the following requirements
  * Accurate, presentable images for each relevant topic
  * Fast, without impact on page load
