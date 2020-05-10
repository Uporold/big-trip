export const getTotalPrice = (array) => {
  let mainPriceSum = 0;
  let offersPriceSum = 0;
  for (let i = 0; i < array.length; i++) {
    let checkPointPrice = array[i].price;
    mainPriceSum += +checkPointPrice;
    for (let j = 0; j < array[i].offers.length; j++) {

      offersPriceSum += +array[i].offers[j].price;

    }
  }
  return mainPriceSum + offersPriceSum;
};

export const getTrail = (events) => {
  return events.length <= 3 ? events.map((event) => event.destination.name).join(` — `) : `${events[0].destination.name} — ... — ${events[events.length - 1].destination.name}`;
};
