

export class EmailNotFound extends Error {
  constructor(message = 'A user with this e-mail is not found') {
    super(message);
  }

}
