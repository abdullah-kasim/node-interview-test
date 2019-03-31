export class UserDoesNotOwnBoard extends Error {
  constructor(message = 'This user does not own this board') {
    super(message);
  }
}
