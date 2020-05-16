import {typeItemsActivity, typeItemsTransfer} from "../const";
import Offers from "./offers";
import Destination from "./destination";
import {formatTime} from "../utils/time";
import AbstractSmartComponent from "./abstact-smart-component";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {Mode} from "../controllers/event";
import {passNumbersFromString, capitalizeFirstLetter} from "../utils/common";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createTypeMarkup = (type, eventType) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${type === eventType ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-1">${type}</label>
    </div>`
  );
};

const createDestinationListMarkup = (city) => {
  return (
    `<option value="${city}"></option>`
  );
};

const createTripFormTemplate = (event, isFavorite, newType, city, points, types, mode, price, startDate, endDate, externalData) => {
  const {type, offers} = event;
  // console.log(startDate);
  const startTimeForm = formatTime(startDate, true);
  const endTimeForm = formatTime(endDate, true);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  const typeOffersNew = types.find((it) => it.type === newType).offers;
  const isTypeActivity = typeItemsActivity.some((it) => newType === it.toLowerCase()) ? `in` : `to`;

  const filteredInfo = points.find((it)=> it.name === city);
  const updateDescription = filteredInfo ? filteredInfo.description : [];
  const updatePhoto = filteredInfo ? filteredInfo.pictures : [];

  const transferMarkup = typeItemsTransfer.map((it) => createTypeMarkup(it.toLowerCase(), newType)).join(`\n`);
  const activityMarkup = typeItemsActivity.map((it) => createTypeMarkup(it.toLowerCase(), newType)).join(`\n`);
  const destinationListMarkup = points.map((it) => createDestinationListMarkup(it.name)).join(`\n`);

  return (
    `<form class="trip-events__item  event  event--edit" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type ? newType : `bus`}.png" alt="Event type icon">
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
              ${newType ? capitalizeFirstLetter(newType) : `Bus to`} ${isTypeActivity}
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeForm}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeForm}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
          <button class="event__reset-btn" type="reset">${mode !== Mode.ADDING ? `${deleteButtonText}` : `Cancel`}</button>
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
       <section class="event__details">
        ${typeOffersNew.length ? `${new Offers(typeOffersNew, offers).getTemplate()}` : ``}
        ${updateDescription.length ? `${new Destination(updateDescription, updatePhoto).getTemplate()}` : ``}
       </section>
    </form>`
  );
};

export default class TripForm extends AbstractSmartComponent {
  constructor(event, points, types, mode) {
    super();

    this._event = event;
    this._isFavorite = event.isFavorite;
    this._type = event.type;
    this._city = event.destination.name;
    this._price = event.price;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this._points = points;
    this._types = types;
    this._mode = mode;
    this._externalData = DefaultData;


    this._submitHandler = null;
    this._favoriteHandler = null;
    this._arrowHandler = null;
    this._deleteButtonClickHandler = null;


    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._applyFlatpickr();
    this._subscribeOnEvents();


  }

  getTemplate() {
    return createTripFormTemplate(this._event, this._isFavorite, this._type, this._city, this._points, this._types, this._mode, this._price, this._startDate, this._endDate, this._externalData);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesButtonClickHandler(this._favoriteHandler);
    this.setArrowHandler(this._arrowHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }


  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = (evt) => handler(evt, this._event.id);
  }

  setFavoritesButtonClickHandler(handler) {
    if (this._mode !== Mode.ADDING) {
      this.getElement().querySelector(`.event__favorite-btn`)
       .addEventListener(`click`, handler);
      this._favoriteHandler = handler;
    }
  }

  setArrowHandler(handler) {
    if (this._mode !== Mode.ADDING) {
      this.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);
      this._arrowHandler = handler;
    }
  }


  removeFlatpickr() {
    if (this._flatpickrStart && this._flatpickrEnd) {
      this._flatpickrStart.destroy();
      this._flatpickrEnd.destroy();
      this._flatpickrStart = null;
      this._flatpickrEnd = null;
    }
  }

  removeElement() {
    this.removeFlatpickr();
    super.removeElement();
  }

  setData(data) {
    // console.log(data);
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }


  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      this._startDate = flatpickr.parseDate(evt.target.value, `d/m/y H:i`);

    });

    element.querySelector(`#event-end-time-1`).addEventListener(`change`, (evt) => {
      this._endDate = flatpickr.parseDate(evt.target.value, `d/m/y H:i`);
    });

    element.querySelectorAll(`.event__type-input`).forEach((input) =>{
      input.addEventListener(`change`, (evt) => {
        this._type = evt.target.value;
        this.rerender();
      });
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      let optionFound = false;
      const datalist = element.querySelector(`.event__input--destination`).list;

      for (let j = 0; j < datalist.options.length; j++) {
        if (evt.target.value === datalist.options[j].value && evt.target.value) {
          optionFound = true;
          break;
        }
      }
      if (optionFound) {
        element.querySelector(`.event__input--destination`).setCustomValidity(``);
        this._city = evt.target.value;
        this.rerender();
      } else {
        element.querySelector(`.event__input--destination`).setCustomValidity(`Please select a valid value.`);
      }

    });

    if (!element.querySelector(`.event__input--destination`).value.length) {
      element.querySelector(`.event__input--destination`).setCustomValidity(`Please select a value.`);
    }
    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._price = passNumbersFromString(evt.target.value);
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrStart && this._flatpickrEnd) {
      this._flatpickrStart.destroy();
      this._flatpickrEnd.destroy();
      this._flatpickrStart = null;
      this._flatpickrEnd = null;
    }

    const self = this;
    this._flatpickrStart = flatpickr((this.getElement().querySelector(`#event-start-time-1`)), {
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      defaultDate: this._event.startDate || `today`,
      minDate: this._event.startDate || `today`,
      onChange(selectedDates) {
        if (self._flatpickrEnd.config._minDate < selectedDates[0]) {
          self._flatpickrEnd.setDate(selectedDates[0], false, `d/m/y H:i`);
        }
        self._flatpickrEnd.set(`minDate`, selectedDates[0]);
      }
    });

    this._flatpickrEnd = flatpickr((this.getElement().querySelector(`#event-end-time-1`)), {
      dateFormat: `d/m/y H:i`,
      enableTime: true,
      defaultDate: this._event.endDate || `today`,
      minDate: this._event.endDate || `today`,
      onChange(selectedDates) {
        self._flatpickrStart.set(`maxDate`, selectedDates[0]);
      },
    });
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();

  }

  reset() {
    // const event = this._event;
    this._type = this._event.type;
    this._city = this._event.destination.name;
    this._price = this._event.price;
    this._startDate = this._event.startDate;
    this._endDate = this._event.endDate;
    this._isFavorite = !!this._event.isFavorite;
    // console.log(this._isFavorite);

    this.rerender();
  }
}


