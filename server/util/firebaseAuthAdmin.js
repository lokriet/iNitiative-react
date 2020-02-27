const admin = require('firebase-admin');
const constants = require('../constants');
const serviceAccount = require(constants.GOOGLE_APPLICATION_CREDENTIALS);

let adminAuth = null;

const getAdminAuth = () => {
  if (!adminAuth) {
    const credential = process.env.NODE_ENV === 'production' ? admin.credential.applicationDefault() : admin.credential.cert(serviceAccount);

    const app = admin.initializeApp({
      credential: credential,
      storageBucket: constants.GOOGLE_STORAGE_BUCKET, 
    });
    adminAuth = app.auth();
  }
  return adminAuth;
}

module.exports = getAdminAuth;