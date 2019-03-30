export class RefreshTokenExpired extends Error {
  constructor(message = 'The refresh token has expired') {
    super(message);
  }
}
