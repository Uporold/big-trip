import {formatTime, formatTimeDiff} from "../utils/time";
import {typeItemsActivity} from "../const";
import AbstractComponent from "./abstract-component";
import {capitalizeFirstLetter} from "../utils/common";

const OFFERS_PREVIEW_LIMIT = 3;

export const createTripEventOffersMarkup = (name, price) => {
  return (
    `<li class="event__offer">
       <span class="event__offer-title">${name}</span>
       &plus;
       &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};


const createTripEventTemplate = (event) => {
  const {type, offers, startDate, endDate, price, destination} = event;
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  const timeDiff = endDate - startDate;
  const city = destination.name;
  const offersMarkup = offers.slice(0, OFFERS_PREVIEW_LIMIT).map((it) => createTripEventOffersMarkup(it.title, it.price)).join(`\n`);
  const isTypeActivity = typeItemsActivity.some((it) => type === it.toLowerCase()) ? `in` : `to`;

  return (
    `<li class="trip-events__item">
         <div class="event">
           <div class="event__type">
             <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
           </div>
           <h3 class="event__title">${capitalizeFirstLetter(type)} ${isTypeActivity} ${city}</h3>

           <div class="event__schedule">
             <p class="event__time">
               <time class="event__start-time" datetime="2019-03-18T11:00">${startTime}</time>
               &mdash;
               <time class="event__end-time" datetime="2019-03-18T11:00">${endTime}</time>
             </p>
             <p class="event__duration">${formatTimeDiff(timeDiff)}</p>
           </div>

           <p class="event__price">
             &euro;&nbsp;<span class="event__price-value">${price}</span>
           </p>

           <h4 class="visually-hidden">Offers:</h4>
           <ul class="event__selected-offers">
             ${offersMarkup}
           </ul>

           <button class="event__rollup-btn" type="button">
             <span class="visually-hidden">Open event</span>
           </button>
         </div>
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  setArrowHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}


