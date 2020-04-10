import {generateSelectors} from "./selector";
import {photos, descriptions, typeItems, cityItems} from "../const";
import {shuffleArray} from "../utils";


const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDate = (date) => {
  const targetDate = new Date(date);
  const diffDays = getRandomIntegerNumber(0, 2);
  const diffMinutes = getRandomIntegerNumber(0, 90);

  targetDate.setDate(targetDate.getDate() + diffDays);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const generateEvent = () => {
  const startDate = getRandomDate(new Date());
  return {
    type: getRandomArrayItem(typeItems),
    city: cityItems.pop(),
    offers: shuffleArray(generateSelectors()).slice(Math.random() * generateSelectors().length),
    info: {
      description: shuffleArray(descriptions).slice(Math.random() * descriptions.length),
      photo: shuffleArray(photos).slice(Math.random() * photos.length),
    },
    startDate,
    endDate: getRandomDate(startDate),
    price: getRandomIntegerNumber(10, 1000)
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents};