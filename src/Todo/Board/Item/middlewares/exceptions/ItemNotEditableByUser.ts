export class ItemNotEditableByUser extends Error {
  constructor(message = 'This user is not allowed to edit this item') {
    super(message);
  }
}
