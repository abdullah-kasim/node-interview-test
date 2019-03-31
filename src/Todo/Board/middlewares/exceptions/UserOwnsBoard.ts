export class UserDoesNotOwnBoard extends Error {
  constructor(
    message = 'Unable to do execute this action as the user is the owner of the board'
  ) {
    super(message);
  }
}
