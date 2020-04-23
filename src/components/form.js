import {typeItemsActivity, typeItemsTransfer} from "../const";
import Offers from "./offers";
import Destination from "./destination";
import {formatTime} from "../utils/time";
import AbstractSmartComponent from "./abstact-smart-component";

const createTypeMarkup = (type, eventType) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${type === eventType ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`
  );
};

const createTripFormTemplate = (event, options = {}) => {
  const {type, city, offers, startDate, endDate, info, price} = event;
  const {isFavorite} = options;
  const startTimeForm = formatTime(startDate, true);
  const endTimeForm = formatTime(endDate, true);
  const photo = info.photo;
  const description = info.description;
  const transferMarkup = typeItemsTransfer.map((it) => createTypeMarkup(it, type)).join(`\n`);
  const activityMarkup = typeItemsActivity.map((it) => createTypeMarkup(it, type)).join(`\n`);
  return (
    `<form class="trip-events__item  event  event--edit" method="post">
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeForm ? startTimeForm : `18/03/19 00:00`}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeForm ? endTimeForm : `18/03/19 00:00`}">
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
          ${type ?
      `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `Checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
            </svg>
          </label>`
      : ``}
          <button class="event__rollup-btn" type="button">
             <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${!type || (photo || description) ?
      `<section class="event__details">
        ${new Offers(offers).getTemplate()}
        ${new Destination(description, photo).getTemplate()}
       </section>`
      : ``}
    </form>`
  );
};

export default class TripForm extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;
    this._isFavorite = event.isFavorite;

    this._submitHandler = null;
    this._FavoriteHandler = null;
    this._ArrowHandler = null;
  }

  getTemplate() {
    return createTripFormTemplate(this._event, {
      isFavorite: this._isFavorite});
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesButtonClickHandler(this._FavoriteHandler);
    this.setArrowHandler(this._ArrowHandler);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);
    this._FavoriteHandler = handler;
  }

  setArrowHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._ArrowHandler = handler;
  }

  rerender() {
    super.rerender();

  }

  reset() {
    const event = this._event;
    this._isFavorite = !!event.isFavorite;
    this.rerender();
  }
}


