export const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date, forForm = false) => {
  const years = castTimeFormat(date.getUTCFullYear()) % 2000;
  const months = castTimeFormat(date.getMonth());
  const days = castTimeFormat(date.getDate());
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return forForm ? `${days}/${months}/${years} ${hours}:${minutes}` : `${hours}:${minutes}`;
};

export const formatTimeDiff = (timeDiff) => {
  const time = Math.floor((timeDiff) / 60000);
  const minutes = time % 60;
  const days = Math.round((time - minutes) / 1440);
  const hours = Math.round((time - minutes) / 60 - days * 24);

  return `${days > 0 ? days + `D` : ``} ${hours > 0 ? hours + `H` : ``} ${minutes > 0 ? minutes + `M` : ``}`;
};

export const getTotalPrice = (array) => {
  let mainPriceSum = 0;
  let offersPriceSum = 0;
  for (let i = 0; i < array.length; i++) {
    let checkPointPrice = array[i].price;
    mainPriceSum += checkPointPrice;
    for (let j = 0; j < array[i].offers.length; j++) {
      offersPriceSum += array[i].offers[j].price;
    }
  }
  return mainPriceSum + offersPriceSum;
};

export const getTrail = (array) => {
  let cities = [];
  for (let checkpoint of array) {
    cities.push(checkpoint.city);
  }
  return cities.join(` — `);
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

