import {cityItems, descriptions} from "../const";
import {getRandomIntegerNumber, shuffleArray} from "../utils/randomize";

const getRandomDescription = () => {
  return shuffleArray(descriptions).slice(Math.random() * descriptions.length);
};

const getRandomPhotos = () => {
  const photosArray = [];
  for (let i = 0; i < getRandomIntegerNumber(0, 5); i++) {
    photosArray.push(`http://picsum.photos/248/152?r=${i + Math.random() * 100}`);
  }
  return photosArray;
};

export const generatePointInfo = () => {
  return cityItems.map((cityName) => {
    return {
      name: cityName,
      description: getRandomDescription(),
      photo: getRandomPhotos()
    };
  });
};

