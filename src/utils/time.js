import {months} from "../const";
import moment from "moment";

export const formatTime = (date, forForm = false) => {
  return forForm ? moment(date).format(`D/M/YY`) : moment(date).format(`HH:mm`);
};

export const formatTimeDiff = (timeDiff) => {
  const duration = moment.duration(timeDiff);
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${days > 0 ? days + `D` : ``} ${hours > 0 ? hours + `H` : ``} ${minutes > 0 ? minutes + `M` : ``}`;
};

export const getNoRepeatingDates = (events) => {
  const set = new Set();
  events.forEach((evt) => set.add(JSON.stringify({day: evt.startDate.getDate(), month: months[evt.startDate.getMonth()]})));
  return Array.from(set).map((evt) => JSON.parse(evt));
};
