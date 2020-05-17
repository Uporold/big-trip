export const passNumbersFromString = (str) => {
  return str.replace(/[^0-9]+/g, ``);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const switchFormAvailability = (form, disableFlag) => {
  const inputs = form.getElementsByTagName(`input`);
  const buttons = form.getElementsByTagName(`button`);

  changeStatus(inputs, disableFlag);
  changeStatus(buttons, disableFlag);
};

const changeStatus = (elements, disableFlag) => {
  let length = elements.length;
  while (length--) {
    elements[length].disabled = disableFlag;
  }
};
