

export class RefreshTokenExpired extends Error {
  constructor(message = 'This email is already used') {
    super(message);
  }

}
