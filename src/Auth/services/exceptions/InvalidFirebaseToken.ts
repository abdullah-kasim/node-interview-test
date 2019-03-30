

export class InvalidFirebaseToken extends Error {
  constructor(message = 'The firebase token is invalid') {
    super(message);
  }

}
