export const passNumbersFromString = (str) => {
  return str.replace(/^\D+/g, ``);
};
