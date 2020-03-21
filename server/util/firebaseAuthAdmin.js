const admin = require('firebase-admin');

let adminAuth = null;

const getAdminAuth = () => {
  if (!adminAuth) {
    const credential = admin.credential.applicationDefault();

    const app = admin.initializeApp({
      credential: credential,
      storageBucket: process.env.GOOGLE_STORAGE_BUCKET, 
    });
    adminAuth = app.auth();
  }
  return adminAuth;
}

module.exports = getAdminAuth;