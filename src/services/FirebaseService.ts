import firebaseAdmin from 'firebase-admin';
import { User } from '../models/User';

export class FirebaseService {
  static sendMessage = async (user: User, data: any) => {
    const tokens = user.devices
      .map(device => {
        return device.firebase_cloud_token;
      })
      .filter(token => {
        return token !== null;
      });
    await firebaseAdmin.messaging().sendMulticast({
      data,
      tokens
    });
    return true;
  };

  static getUser = async firebaseToken => {
    try {
      const res = await firebaseAdmin.auth().verifyIdToken(firebaseToken, true);
      return await firebaseAdmin.auth().getUser(res.uid);
    } catch (e) {
      return null;
    }
  };
}
