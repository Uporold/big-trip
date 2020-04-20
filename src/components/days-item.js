import AbstractComponent from "./abstract-component";
import {createElement} from "../utils/render";

const createTripDayItemMarkup = (it, index) => {
  return (
    `<li class="trip-days__item  day">
         <div class="day__info">
           <span class="day__counter">${it ? `${index + 1}` : ``}</span>
           <time class="day__date" datetime="2019-03-18">${it ? `${it.month} ${it.day}` : ``}</time>
         </div>
         <ul class="trip-events__list"> </ul>
    </li>`
  );
};


const createTripDaysItemTemplate = (days) => {
  return days === `` ? createTripDayItemMarkup() : days.map((it, index) => createTripDayItemMarkup(it, index)).join(`\n`);
};

export default class DaysItem extends AbstractComponent {
  constructor(days) {
    super();
    this._days = days;
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

}

