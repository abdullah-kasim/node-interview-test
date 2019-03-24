import crypto, {randomBytes} from 'src/helpers/RandomHelper'
import {env} from "../settings/env";

import {promisify} from "util";

export class Hmac {
  static sign = async (text: string) => {
    const key = env.APP_KEY
    const keyBytes = key.split('').map((char) => {
      return char.charCodeAt(0).toString(2)
    })
    const randomBytesGenerator = promisify(randomBytes)
    const salt = (await randomBytesGenerator(50)).toString('base64')
    const keyWithSalt = `${key}${salt}`
    const hash = crypto.createHmac('sha256', keyWithSalt).update(text).digest('hex')
    const textBase64 = btoa(text)
    return `${textBase64}.${hash}.${salt}`
  }

  static verify = (signedText: string) => {
    const splittedSignedText = signedText.split('.')
    const key = env.APP_KEY
    const text = atob(splittedSignedText[0])
    const salt = splittedSignedText[2]
    const hash = splittedSignedText[1]
    const keyWithSalt = `${key}${salt}`
    const computedHash = crypto.createHmac('sha256', keyWithSalt).update(text).digest('hex')
    return computedHash === hash;
  }
}
