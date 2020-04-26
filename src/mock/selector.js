import {typeItems} from "../const";

export const createOffersArray = (type, amount, checkFlag) => {
  const selectors = [];
  for (let i = 0; i < amount; i++) {
    selectors.push(generateSelectors(type, i, checkFlag));
  }
  return selectors;
};

export const generateOffers = () => {
  return typeItems.map((type) => {
    return generateOffersObject(type, 5);
  });
};

const generateOffersObject = (type) => {
  return {
    type,
    offers: createOffersArray(type, 5)
  };
};
const generateSelectors = (type, i, checkFlag = false) => {
  return {
    name: type + `Offer${i + 1}`,
    price: Math.floor(Math.random() * 100),
    title: type + ` offer ${i + 1}`,
    isChecked: checkFlag ? Math.random() > 0.5 : false
  };
};

