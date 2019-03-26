

export const isTrueString = (truthValue) => {
  // it should be true if casted to boolean, or if it's a string.
  if (typeof truthValue === "string") {
    return "true" === truthValue.toLowerCase()
  }
  return false
}
