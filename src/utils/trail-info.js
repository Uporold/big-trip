export const getTotalPrice = (array) => {
  let mainPriceSum = 0;
  let offersPriceSum = 0;
  for (let i = 0; i < array.length; i++) {
    let checkPointPrice = array[i].price;
    mainPriceSum += checkPointPrice;
    for (let j = 0; j < array[i].offers.length; j++) {
      if (array[i].offers[j].isChecked) {
        offersPriceSum += array[i].offers[j].price;
      }
    }
  }
  return mainPriceSum + offersPriceSum;
};

export const getTrail = (events) => {
  return events.length <= 3 ? events.map((event) => event.info.city).join(` — `) : `${events[0].info.city} — ... — ${events[events.length - 1].info.city}`;
};
