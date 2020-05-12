import EventComponent from "../components/event";
import TripFormComponent from "../components/form";
import {render, replace, remove} from "../utils/render";
import {RenderPosition} from "../utils/render";
import Point from "../models/point";
import flatpickr from "flatpickr";
import {switchFormAvailability} from "../utils/common";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  startDate: null,
  endDate: null,
  type: `bus`,
  destination: {
    name: ``,
    description: [],
    photo: []
  },
  price: 0,
  offers: []
};

const parseFormData = (formData, allOffers, allDestinations) => {
  const type = formData.get(`event-type`);
  const startDate = flatpickr.parseDate(formData.get(`event-start-time`), `d/m/y H:i`);
  const endDate = flatpickr.parseDate(formData.get(`event-end-time`), `d/m/y H:i`);

  const typeOffersNew = allOffers.find((it) => it.type.toString() === type).offers;
  const offersFromForm = formData.getAll(`event-offer`);
  const checkedOffers = typeOffersNew.filter((offer) => offersFromForm.some((formOffer) => offer.title === formOffer));

  const city = formData.get(`event-destination`);
  const checkedDestination = allDestinations.find((it)=> it.name === city);

  return new Point({
    "type": type,
    "destination": checkedDestination,
    "base_price": Number(formData.get(`event-price`)),
    "date_from": startDate,
    "date_to": endDate,
    "offers": checkedOffers,
    "is_favorite": Boolean(formData.get(`event-favorite`)),
  });
};

export default class EventController {
  constructor(container, onDataChange, onViewChange, points, types) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._points = points;
    this._types = types;
    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new TripFormComponent(event, this._points, this._types, this._mode);

    this._eventComponent.setArrowHandler(() => {
      this._replaceEventToEdit();
      this._eventEditComponent.reset();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setArrowHandler(() => {
      if (this._mode !== Mode.ADDING) {
        this._replaceEditToEvent();
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      } else {
        this._onDataChange(EmptyEvent, null);
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      }
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const data = Point.clone(event);
      data.isFavorite = !data.isFavorite;
      this._onDataChange(event, data);

    });

    this._eventEditComponent.setSubmitHandler((evt, id) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._types, this._points);
      data.id = id || new Date().valueOf().toString();
      this._eventEditComponent.setData({
        saveButtonText: `Saving...`
      });
      switchFormAvailability(this._eventEditComponent.getElement(), true);
      this._onDataChange(event, data);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      if (this._mode !== Mode.ADDING) {
        this._eventEditComponent.setData({
          deleteButtonText: `Deleting...`,
        });
        switchFormAvailability(this._eventEditComponent.getElement(), true);
        this._onDataChange(event, null);
      } else {
        this._onDataChange(EmptyEvent, null);
      }
    });

    switch (mode) {
      case Mode.DEFAULT:
        document.querySelector(`.trip-main__event-add-btn`).disabled = false;
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent);
        }
        break;
      case Mode.ADDING:
        document.querySelector(`.trip-main__event-add-btn`).disabled = true;
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        this._eventEditComponent._subscribeOnEvents();
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT && this._mode !== Mode.ADDING) {
      this._replaceEditToEvent();
    } else {
      remove(this._eventEditComponent);
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._eventEditComponent.getElement().style = `box-shadow: 0px 0px 15px 0px rgba(245,32,32,1);`;
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._eventEditComponent.getElement().style = ``;
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceEditToEvent() {
    this._eventEditComponent.reset();
    replace(this._eventComponent, this._eventEditComponent);

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {

      if (this._mode === Mode.ADDING) {
        this._onDataChange(EmptyEvent, null);
      }

      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
