import AbstractComponent from "./abstract-component";

const createTripInfoTemplate = (trail, days) => {
  const daysInterval = `${days.length ? `${days[0].month} ${days[0].day}&nbsp;&nbsp;&mdash;&nbsp;${days[0].month !== days[days.length - 1].month ? days[days.length - 1].month : ``} ${days[days.length - 1].day}` : ``}`;
  return (
    `<div class="trip-info__main">
       <h1 class="trip-info__title">${trail}</h1>
       <p class="trip-info__dates">${daysInterval}</p>
     </div>`
  );
};

export default class Trail extends AbstractComponent {
  constructor(trail, days) {
    super();
    this._trail = trail;
    this._days = days;
  }

  getTemplate() {
    return createTripInfoTemplate(this._trail, this._days);
  }
}

