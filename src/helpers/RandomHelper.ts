import {promisify} from "util";
import {randomBytes} from "crypto";


/**
 * These are not necessarily cryptographically secure. Don't use this for signing.
 */
export class RandomHelper {
  static randomString = async (length) => {
    const randomBytesGenerator = promisify(randomBytes)
    return (await randomBytesGenerator(100)).toString('base64').substring(0, length)
  }
}
