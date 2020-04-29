import {typeItemsActivity, typeItemsTransfer, cityItems} from "../const";
import Offers from "./offers";
import Destination from "./destination";
import {formatTime} from "../utils/time";
import AbstractSmartComponent from "./abstact-smart-component";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {createOffersArray} from "../mock/selector";
import {Mode} from "../controllers/event";

const createTypeMarkup = (type, eventType) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === eventType ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`
  );
};

const createDestinationListMarkup = (city) => {
  return (
    `<option value="${city}"></option>`
  );
};

const createTripFormTemplate = (event, isFavorite, newType, city, points, types, mode) => {
  const {type, offers, info, startDate, endDate, price} = event;
  const startTimeForm = formatTime(startDate, true);
  const endTimeForm = formatTime(endDate, true);
  const photo = info.photo;
  const description = info.description;
  const oldCity = info.city;

  const typeOffersNew = types.find((it) => it.type === newType);
  const updateTypes = type === typeOffersNew.type ? offers : typeOffersNew.offers;

  const filteredInfo = points.find((it)=> it.city === city);
  const updateDescription = oldCity !== city ? filteredInfo.description : description;
  const updatePhoto = oldCity !== city ? filteredInfo.photo : photo;

  const transferMarkup = typeItemsTransfer.map((it) => createTypeMarkup(it, newType)).join(`\n`);
  const activityMarkup = typeItemsActivity.map((it) => createTypeMarkup(it, newType)).join(`\n`);
  const destinationListMarkup = cityItems.filter((it) => it !== city).map((it) => createDestinationListMarkup(it)).join(`\n`);

  return (
    `<form class="trip-events__item  event  event--edit" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type ? newType.toLowerCase() : `bus`}.png" alt="Event type icon">
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
              ${newType ? newType : `Bus`} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city ? city : ``}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationListMarkup}
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
          <button class="event__reset-btn" type="reset">${mode !== Mode.ADDING ? `Delete` : `Cancel`}</button>
          ${mode !== Mode.ADDING ?
      `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `Checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
             <span class="visually-hidden">Open event</span>
          </button>`
      : ``}
        </header>
        ${!type || (photo || description) ?
      `<section class="event__details">
        ${offers.length ?
      `${new Offers(updateTypes).getTemplate()}`
      : ``}
        ${new Destination(updateDescription, updatePhoto).getTemplate()}
       </section>`
      : ``}
    </form>`
  );
};

const parseFormData = (formData) => {
  const type = formData.get(`event-type`);
  const startDate = flatpickr.parseDate(formData.get(`event-start-time`), `d/m/y H:i`);
  const endDate = flatpickr.parseDate(formData.get(`event-end-time`), `d/m/y H:i`);

  return {
    type,
    startDate,
    endDate,
    info: {
      city: formData.get(`event-destination`)
    },
    offers: createOffersArray(type, 5, true),
    price: formData.get(`event-price`)
  };
};

export default class TripForm extends AbstractSmartComponent {
  constructor(event, points, types, mode) {
    super();

    this._event = event;
    this._isFavorite = event.isFavorite;
    this._type = event.type;
    this._city = event.info.city;
    this._points = points;
    this._types = types;
    this._mode = mode;

    this._submitHandler = null;
    this._FavoriteHandler = null;
    this._ArrowHandler = null;
    this._deleteButtonClickHandler = null;

    this._flatpickr = null;
    this._applyFlatpickr();


  }

  getTemplate() {
    return createTripFormTemplate(this._event, this._isFavorite, this._type, this._city, this._points, this._types, this._mode);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesButtonClickHandler(this._FavoriteHandler);
    this.setArrowHandler(this._ArrowHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    if (this._mode !== Mode.ADDING) {
      this.getElement().querySelector(`.event__favorite-btn`)
        .addEventListener(`click`, handler);
      this._FavoriteHandler = handler;
    }
  }

  setArrowHandler(handler) {
    if (this._mode !== Mode.ADDING) {
      this.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);
      this._ArrowHandler = handler;
    }
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelectorAll(`.event__type-input`).forEach((input) =>{
      input.addEventListener(`change`, (evt) => {
        this._type = evt.target.value;
        this.rerender();
      });
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      if (this._points.find((it) => it.city === evt.target.value)) {
        this._city = evt.target.value;
        this.rerender();
      }
    });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const createFlatpickrOptions = (date) => {
      return {
        allowInput: true,
        enableTime: true,
        dateFormat: `d/m/y H:i`,
        defaultDate: date || `today`
      };
    };

    const dateBeginElement = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpickr = flatpickr(dateBeginElement, Object.assign({}, createFlatpickrOptions(this._event.startDate)));
    this._flatpickr = flatpickr(dateEndElement, Object.assign({}, createFlatpickrOptions(this._event.endDate)));

  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();

  }

  reset() {
    const event = this._event;
    this._type = this._event.type;
    this._city = this._event.info.city;
    this._isFavorite = !!event.isFavorite;
    this.rerender();
  }
}


