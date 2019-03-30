export class InvalidHmac extends Error {
  constructor(message = 'The payload is an invalid hmac') {
    super(message);
  }
}
