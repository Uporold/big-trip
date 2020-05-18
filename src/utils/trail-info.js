const FULL_PATH_CITIES_COUNT = 3;

export const getTotalPrice = (array) => {
  let mainPriceSum = 0;
  let offersPriceSum = 0;
  array.forEach((event) => {
    let checkPointPrice = event.price;
    mainPriceSum += +checkPointPrice;
    event.offers.forEach((offer) => {
      offersPriceSum += +offer.price;
    });
  });
  return mainPriceSum + offersPriceSum;
};

export const getTrail = (events) => {
  return events.length <= FULL_PATH_CITIES_COUNT ? events.map((event) => event.destination.name).join(` — `) : `${events[0].destination.name} — ... — ${events[events.length - 1].destination.name}`;
};
