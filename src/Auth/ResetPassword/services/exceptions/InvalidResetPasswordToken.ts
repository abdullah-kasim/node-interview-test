export class InvalidResetPasswordToken extends Error {
  constructor(message = 'The reset password token is invalid') {
    super(message);
  }
}
