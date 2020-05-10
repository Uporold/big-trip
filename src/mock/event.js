import {createOffersArray} from "./selector";
import {typeItems} from "../const";
import {getRandomIntegerNumber, getRandomArrayItem} from "../utils/randomize";

const getRandomDate = (date) => {
  const targetDate = new Date(date);
  const diffDays = getRandomIntegerNumber(-2, 2);
  const diffMinutes = getRandomIntegerNumber(0, 90);

  targetDate.setDate(targetDate.getDate() + diffDays);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const generateEvent = (point) => {
  const startDate = getRandomDate(new Date());
  const type = getRandomArrayItem(typeItems);
  const destination = getRandomArrayItem(point);
  return {
    id: String(new Date().valueOf() + Math.random()),
    type,
    offers: createOffersArray(type, 3),
    destination,
    startDate,
    endDate: getRandomDate(startDate),
    price: getRandomIntegerNumber(10, 1000),
    isFavorite: Math.random() > 0.5
  };
};

const generateEvents = (count, point) => {
  return new Array(count).fill(``).map(() => generateEvent(point));
};

export {generateEvent, generateEvents};
