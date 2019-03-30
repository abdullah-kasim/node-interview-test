export class InvalidFirebaseCloudToken extends Error {
  constructor(message = 'The firebase cloud token is invalid') {
    super(message);
  }
}
