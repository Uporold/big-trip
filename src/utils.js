import {months} from "./const";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date, forForm = false) => {
  const year = castTimeFormat(date.getUTCFullYear()) % 2000;
  const month = castTimeFormat(date.getMonth());
  const day = castTimeFormat(date.getDate());
  const hour = castTimeFormat(date.getHours() % 12);
  const minute = castTimeFormat(date.getMinutes());

  return forForm ? `${day}/${month}/${year} ${hour}:${minute}` : `${hour}:${minute}`;
};

export const formatTimeDiff = (timeDiff) => {
  const time = Math.floor((timeDiff) / 60000);
  const minutes = time % 60;
  const days = Math.round((time - minutes) / 1440);
  const hours = Math.round((time - minutes) / 60 - days * 24);

  return `${days > 0 ? days + `D` : ``} ${hours > 0 ? hours + `H` : ``} ${minutes > 0 ? minutes + `M` : ``}`;
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

export const getNoRepeatingDates = (events) => {
  let arr = [];
  for (let k = 0; k < events.length; k++) {
    let day = events[k].startDate.getDate();
    let monthId = events[k].startDate.getMonth();
    let month = months[monthId];
    arr.push({day, month});
  }

  return arr.reduce((acc, current) => {
    const x = acc.find((item) => item.day === current.day);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const createElements = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement;
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};
