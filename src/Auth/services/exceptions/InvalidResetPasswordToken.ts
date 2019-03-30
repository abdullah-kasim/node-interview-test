export class InvalidResetPasswordToken extends Error {
  constructor(message = 'The firebase token is invalid') {
    super(message);
  }
}
