/**
* @file          s3config.js
* @description   This file is resopnsible to configure and upload image over the aws s3 resource.
* @requires      aws is a collection of software and allow to upload the file over the aws s3 resource.
* @requires      multer  is resopnsible for handling multipart/form-data.
* @requires      multerS3  Streaming multer storage engine for AWS S3.
* @author        Aakash Rajak <aakashrajak2809@gmail.com>
*-----------------------------------------------------------------------------------------------------*/

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.REGION,
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, callback) => {
      callback(null, Date.now().toString());
    },
  }),
});

module.exports = upload;