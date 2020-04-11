import {months} from "../const";
import {getRandomArrayItem, getRandomIntegerNumber} from "../utils";

export const generateDaysCount = () => {
  return {
    number: getRandomIntegerNumber(1, 31),
    month: getRandomArrayItem(months)
  };
};

export const generateDaysCounts = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateDaysCount);
};
