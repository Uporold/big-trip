import {createElement} from "../utils";

const createTripDayItemMarkup = (it, index) => {
  return (
    `<li class="trip-days__item  day">
         <div class="day__info">
           <span class="day__counter">${index + 1}</span>
           <time class="day__date" datetime="2019-03-18">${it.month} ${it.day}</time>
         </div>
         <ul class="trip-events__list"> </ul>
    </li>`
  );
};

const createTripDaysItemTemplate = (days) => {
  const tripDayItems = days.map((it, index) => createTripDayItemMarkup(it, index)).join(`\n`);
  return (
    `${tripDayItems}`
  );
};

export default class DaysItem {
  constructor(days) {
    this._days = days;
    this._element = null;
  }

  getTemplate() {
    return createTripDaysItemTemplate(this._days);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(), true);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

