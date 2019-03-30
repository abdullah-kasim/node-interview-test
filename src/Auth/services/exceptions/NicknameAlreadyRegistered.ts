

export class NicknameAlreadyRegistered extends Error {
  constructor(message = 'This nickname is already used') {
    super(message);
  }

}
