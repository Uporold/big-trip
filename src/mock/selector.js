
const generateSelectors = (type, i) => {
  return {
    type,
    name: type + `Offer${i + 1}`,
    price: Math.floor(Math.random() * 100),
    title: type + ` offer ${i + 1}`
  };
};

export const createOffersArray = (amount, type) => {
  const selectors = [];
  for (let i = 0; i < amount; i++) {
    selectors.push(generateSelectors(type, i));
  }
  return selectors;
};
