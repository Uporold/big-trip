export const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
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

export const getTrail = (events) => {
  return events.length <= 3 ? events.map((event) => event.city).join(` — `) : `${events[0].city} — ... — ${events[events.length - 1].city}`;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};
