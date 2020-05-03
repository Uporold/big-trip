import {FilterType} from "../const";
import moment from "moment";

export const isPastDate = (dueDate, date) => {
  return dueDate < date;
};

export const isFutureDate = (dueDate, date) => {
  return dueDate > date && !isOneDay(date, dueDate);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

export const getFilteredEvents = (events, date, filterType) => {
  return events.filter((event) => {
    const dueDate = event.startDate;

    if (!dueDate) {
      return false;
    }

    return filterType === FilterType.PAST ? isPastDate(dueDate, date) : isFutureDate(dueDate, date);
  });
};

export const getEventsByFilter = (events, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return events;
    case FilterType.PAST:
      return getFilteredEvents(events, nowDate, filterType);
    case FilterType.FUTURE:
      return getFilteredEvents(events, nowDate, filterType);
  }

  return events;
};
