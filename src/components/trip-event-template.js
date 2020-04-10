import {createTripFormTemplate} from "./trip-form-template";
import {formatTime, formatTimeDiff} from "../utils";

export const createTripEventOffersMarkup = (name, price) => {
  return (
    `<li class="event__offer">
       <span class="event__offer-title">${name}</span>
       &plus;
       &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

export const createTripEventTemplate = (event, editFlag = false) => {
  const {type, city, offers, startDate, endDate, info, price} = event;
  const photo = info.photo;
  const description = info.description;
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  const startTimeForm = formatTime(startDate, true);
  const endTimeForm = formatTime(endDate, true);
  const timeDiff = endDate - startDate;
  const offersMarkup = offers.map((it) => createTripEventOffersMarkup(it.title, it.price)).join(`\n`);

  return (
    !editFlag ?
      `<li class="trip-events__item">
         <div class="event">
           <div class="event__type">
             <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
           </div>
           <h3 class="event__title">${type} ${type === `Check-in` || type === `Sightseeing` || type === `Restaurant` ? `in` : `to`} ${city}</h3>

           <div class="event__schedule">
             <p class="event__time">
               <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
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
    </li>` :
      createTripFormTemplate(type, offers, startTimeForm, endTimeForm, photo, description, price, city)
  );
};


