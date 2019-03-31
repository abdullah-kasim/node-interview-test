import firebaseAdmin from "firebase-admin"

export class FirebaseService {
  static sendMessage = async (tokens: string[], data: any) => {
    const stringifiedData = Object.keys(data).reduce((previousValue, key, currentIndex) => {
      let stringifiedRow = null
      if (typeof data[key] === "string") {
        stringifiedRow = data[key]
      } else {
        stringifiedRow = JSON.stringify(data[key])
      }
      return {
        ...previousValue,
        [key]: stringifiedRow
      }
    }, {})

    try {
      const response = await firebaseAdmin.messaging().sendMulticast(
        {
          data: stringifiedData,
          tokens
        },
        false
      )
      return response
    } catch (e) {
      return false
    }
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
