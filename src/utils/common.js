export const passNumbersFromString = (str) => {
  return str.replace(/[^0-9]+/g, ``);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
