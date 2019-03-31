import firebaseAdmin from "firebase-admin"

export class FirebaseService {
  static sendMessage = async (tokens: string[], data: any) => {
    return await firebaseAdmin.messaging().sendMulticast({
      data,
      tokens
    })
  }

  static getUser = async firebaseToken => {
    try {
      const res = await firebaseAdmin.auth().verifyIdToken(firebaseToken, true)
      return await firebaseAdmin.auth().getUser(res.uid)
    } catch (e) {
      return null
    }
  }
}
