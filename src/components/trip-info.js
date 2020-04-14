import {createElement} from "../utils";

const createTripInfoTemplate = (trail, days) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${trail}</h1>
          <p class="trip-info__dates">${days[0].month} ${days[0].day}&nbsp;&nbsp;&mdash;&nbsp;${days[0].month !== days[days.length - 1].month ? days[days.length - 1].month : ``} ${days[days.length - 1].day}</p>
        </div>
     </section>`
  );
};

export default class Trail {
  constructor(trail, days) {
    this._trail = trail;
    this._days = days;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._trail, this._days);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

