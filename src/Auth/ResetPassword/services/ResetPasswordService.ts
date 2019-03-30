import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import querystring from 'querystring';
import * as _ from 'lodash';
import moment from 'moment';
import { User } from '../../../models/User';
import { MailerService } from '../../../services/MailerService';
import { env } from '../../../settings/env';
import { CryptHelper } from '../../../helpers/CryptHelper';
import { UserRepository } from '../../../repositories/UserRepository';
import { EmailNotFound } from '../../services/exceptions/EmailNotFound';
import { AuthService } from '../../services/AuthService';
import { InvalidResetPasswordToken } from './exceptions/InvalidResetPasswordToken';

// Move this to another class
enum TokenType {
  RESET_PASSWORD = 'RESET_PASSWORD'
}

interface Token {
  email: string;
  type: string;
  expireAt: number;
}

export class ResetPasswordService {
  static validateEmailExists = async email => {
    const user = await User.findOne({
      where: {
        email
      }
    });
    return Boolean(user);
  };

  static sendResetEmail = async email => {
    const emailExists = ResetPasswordService.validateEmailExists(email);
    if (!emailExists) {
      throw new EmailNotFound();
    }
    const readFile = util.promisify(fs.readFile);
    const templateString = await readFile(
      path.resolve(__dirname, '../templates/emails/resetEmail.ejs'),
      'utf8'
    );
    await MailerService.sendMail({
      to: email,
      html: _.template(templateString)({
        resetLink: ResetPasswordService.createResetLink(email)
      })
    });
  };

  static createResetLink = email => {
    const queryString = querystring.stringify({
      email,
      type: TokenType.RESET_PASSWORD,
      token: ResetPasswordService.createToken(email)
    });
    return `${env.FRONTEND_URL}/reset?${queryString}`;
  };

  static createToken = email => {
    const payload = {
      email,
      type: TokenType.RESET_PASSWORD,
      expireAt: moment()
        .add(1, 'week')
        .unix()
    };
    const text = JSON.stringify(payload);
    return CryptHelper.encrypt(text);
  };

  static decryptToken = (token): Token => {
    let payload: Token = null;
    try {
      payload = JSON.parse(CryptHelper.decrypt(token)) as Token;
    } catch (error) {
      throw new InvalidResetPasswordToken(error.message);
    }

    // if the current time, is past the expire date
    const now = moment().unix();
    if (now > payload.expireAt) {
      // then the token is invalid.
      throw new InvalidResetPasswordToken();
    }
    return payload;
  };

  static resetPassword = async (newPassword: string, token: string) => {
    const tokenPayload = ResetPasswordService.decryptToken(token);

    const user = await UserRepository.getUserByEmail(tokenPayload.email);
    user.password = await AuthService.hashPassword(newPassword);
    await user.save();
    return user;
  };
}
