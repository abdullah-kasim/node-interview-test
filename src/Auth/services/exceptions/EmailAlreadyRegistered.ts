

export class EmailAlreadyRegistered extends Error {
  constructor(message = 'This email is already used') {
    super(message);
  }

}
