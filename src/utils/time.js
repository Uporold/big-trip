import {months} from "../const";

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
  const time = Math.trunc((timeDiff) / 60000);
  const minutes = time % 60;
  const days = Math.trunc((time - minutes) / 1440);
  const hours = Math.trunc((time - minutes) / 60 - days * 24);

  return `${days > 0 ? days + `D` : ``} ${hours > 0 ? hours + `H` : ``} ${minutes > 0 ? minutes + `M` : ``}`;
};

export const getNoRepeatingDates = (events) => {
  const set = new Set();
  events.forEach((evt) => set.add(JSON.stringify({day: evt.startDate.getDate(), month: months[evt.startDate.getMonth()]})));
  return Array.from(set).map((evt) => JSON.parse(evt));
};
