import crypto, { randomBytes } from 'crypto';
import { promisify } from 'util';
import { env } from '../settings/env';
import { InvalidHmac } from './exceptions/InvalidHmac';

export class HmacHelper {
  /**
   * Should this be called encrypt? But there's no encryption going on...
   * @param text
   */
  static sign = async (text: string) => {
    const key = env.APP_KEY;
    const randomBytesGenerator = promisify(randomBytes);
    const salt = (await randomBytesGenerator(50)).toString('base64');
    const keyWithSalt = `${key}${salt}`;
    const hash = crypto
      .createHmac('sha256', keyWithSalt)
      .update(text)
      .digest('hex');
    const textBase64 = Buffer.from(text).toString('base64');
    return `${textBase64}.${hash}.${salt}`;
  };

  static verify = (signedText: string, returnText: boolean = false) => {
    const splittedSignedText = signedText.split('.');
    const key = env.APP_KEY;
    const text = Buffer.from(splittedSignedText[0], 'base64').toString();
    const salt = splittedSignedText[2];
    const hash = splittedSignedText[1];
    const keyWithSalt = `${key}${salt}`;
    const computedHash = crypto
      .createHmac('sha256', keyWithSalt)
      .update(text)
      .digest('hex');
    const isCorrect = computedHash === hash;
    if (returnText) {
      return [isCorrect, text];
    }

    return isCorrect;
  };

  /**
   * Should this be called decrypt? But there's no decryption going on.
   */
  static decipher = (signedText: string): object => {
    const result = HmacHelper.verify(signedText, true);
    if (!result[0]) {
      throw new InvalidHmac();
    }

    return result[1];
  };
}
