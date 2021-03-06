/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for t`he specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')({keyFilename: 'poehaly-angular2-firebase-firebase-adminsdk-tfaea-ea5a3d26e3.json'});
const spawn = require('child-process-promise').spawn;
const LOCAL_TMP_FOLDER = '/tmp/';
const admin = require('firebase-admin');
var serviceAccount = require("../functions/poehaly-angular2-firebase-firebase-adminsdk-tfaea-ea5a3d26e3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://poehaly-angular2-firebase.firebaseio.com"
});
// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';



/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
exports.generateThumbnail = functions.storage.object().onChange(event => {
  const filePath = event.data.name;
  const filePathSplit = filePath.split('/');
  const fileName = filePathSplit.pop();
  const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');
  const thumbFilePath = `${fileDir}${THUMB_PREFIX}${fileName}`;
  const tempLocalDir = `${LOCAL_TMP_FOLDER}${fileDir}`;
  const tempLocalFile = `${tempLocalDir}${fileName}`;
  const tempLocalThumbFile = `${LOCAL_TMP_FOLDER}${thumbFilePath}`;

  // Exit if this is triggered on a file that is not an image.
  if (!event.data.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a Thumbnail.');
    return;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    const bucket = gcs.bucket(event.data.bucket);
    return bucket.file(filePath).download({
      destination: tempLocalFile
    }).then(() => {
      console.log('The file has been downloaded to', tempLocalFile);
      // Generate a thumbnail using ImageMagick.
      return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile]).then(() => {
        console.log('Thumbnail created at', tempLocalThumbFile);
        // Uploading the Thumbnail.
        return bucket.upload(tempLocalThumbFile, {
          destination: thumbFilePath
        }).then((PATH) => {

          // admin.database().ref('/log').push({
          //   event:event,
          // });
          // let options = {
          //   expires: '10-25-2022',
          //   contentLengthRange: {
          //     min: 0,
          //     max: 50000
          //   }
          // };
          // bucket.file(thumbFilePath).getSignedUrl(options).then((signedUrls)=>{
          //   console.log("signedUrls 1111",signedUrls)
          //     admin.database().ref('/log').push({
          //       signedUrls:signedUrls,
          //     });
          // });
          // admin.storage().ref(thumbFilePath).getDownloadURL().then((path)=> {
          //   admin.database().ref('/log').push({
          //     path:path,
          //   });
          // });

          console.log('Thumbnail uploaded to Storage at', thumbFilePath);
        });
      });
    });
  });
});

