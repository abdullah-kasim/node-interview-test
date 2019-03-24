

export class WrongPassword extends Error {
  constructor(message = 'The password given does not match') {
    super(message);
  }

}
