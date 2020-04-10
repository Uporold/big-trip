import {typeItemsActivity, typeItemsTransfer} from "../const";
import {createTripFormEventOffersTemplate} from "./trip-form-event-offers-template";
import {generateSelectors} from "../mock/selector";
import {createTripFormEventDestinationTemplate} from "./trip-form-event-destination-template";

const createTypeMarkup = (type) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}">
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`
  );
};

export const createTripFormTemplate = (type, array = generateSelectors(), startTime, endTime, photo, description, price, city) => {
  const transferMarkup = typeItemsTransfer.map((it) => createTypeMarkup(it)).join(`\n`);
  const activityMarkup = typeItemsActivity.map((it) => createTypeMarkup(it)).join(`\n`);
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type ? type.toLowerCase() : `bus`}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${transferMarkup}
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${activityMarkup}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type ? type : `Bus`} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city ? city : ``}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="Saint Petersburg"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime ? startTime : `18/03/19 00:00`}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime ? endTime : `18/03/19 00:00`}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price ? price : ``}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        ${!type || (photo || description) ?
      `<section class="event__details">
        ${createTripFormEventOffersTemplate(array)}
        ${createTripFormEventDestinationTemplate(description, photo)}
       </section>`
      : ``}
    </form>`
  );
};


