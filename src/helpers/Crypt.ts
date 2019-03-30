import crypto from 'crypto';
import { env } from '../settings/env';

const ENCRYPTION_KEY = env.APP_KEY; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Reference: https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
 * Ported to use base64 and dot for delimiter
 * Also converted it to not use deprecated methods
 */
export class Crypt {
  static encrypt = text => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('base64') + '.' + encrypted.toString('base64');
  };

  static decrypt = text => {
    const textParts = text.split('.');
    const iv = Buffer.from(textParts.shift(), 'base64');
    const encryptedText = Buffer.from(textParts.join('.'), 'base64');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  };
}
