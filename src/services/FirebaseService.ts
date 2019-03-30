import {User} from "../models/User";
import firebaseAdmin from 'firebase-admin'

export class FirebaseService {
  static sendMessage = async (user: User, data: any) => {
    const tokens = user.devices.map((device) => {
      return device.firebase_token
    }).filter((token) => {
      return token !== null
    })
    await firebaseAdmin.messaging().sendMulticast({
      data,
      tokens
    })
    return true
  }

  static validateToken = async (firebaseToken) => {
    try {
      await firebaseAdmin.auth().verifyIdToken(firebaseToken, true)
      return true
    } catch (e) {
      return false
    }
  }
}
