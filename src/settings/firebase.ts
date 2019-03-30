import admin from 'firebase-admin';

// eslint-disable-next-line
const serviceAccount = require('./credentials/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://aym-interview.firebaseio.com'
});
