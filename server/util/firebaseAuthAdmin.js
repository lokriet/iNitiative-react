const admin = require('firebase-admin');
const constants = require('../constants');

let initialized = false;

const getAdmin = () => {
  if (!initialized) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(), 
      storageBucket: constants.GOOGLE_STORAGE_BUCKET
    });
    initialized = true;
  }
  return admin;
}

module.exports = getAdmin;