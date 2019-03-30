export class InvalidJwtAuthorizationHeader extends Error {
  constructor(message = 'Invalid jwt authorization header') {
    super(message);
  }
}
