# simple lorem image

## Installation and Usage
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
* call server with desired size and limit result with topic parameter

      http://localhost:3000/:width/:height/:topic?
  Example

      $ curl http://localhost:3000/320/250/city

The example would only return image with the string "city" in their names.

## Features
* Filters images in source directory by topic
* Shuffles the resulting list
* Any scaled image is resized just once
* Redirects to the static path of the resulting image
* Images are cacheable in browser

## Known issues
* The app is as simple as possible
* There is no security at all, see below
* There is no support for uploading images but than can be archived with any third party image upload oder (s)ftp tool
* There is no support for subdirectories
* The app might get slow with lots of images

## Security
* There is no security at all and there won't be in a foreseeable future, so use with care!
* The app is intended for local development only, behind a firewall or in a virtual machine
* Any one could create as many sizes of each image as possible, flooding your hdd

## Why
* Existing online services did not satisfy the following requirements
  * Accurate, presentable images for each relevant topic
  * Fast, without impact on page load
