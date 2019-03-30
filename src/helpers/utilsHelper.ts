export const isTrueString = (truthValue): boolean => {
  // it should be true if casted to boolean, or if it's a string.
  if (typeof truthValue === 'string') {
    return truthValue.toLowerCase() === 'true';
  }
  return false;
};
