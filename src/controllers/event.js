import EventComponent from "../components/event";
import TripFormComponent from "../components/form";
import {render, replace, remove} from "../utils/render";
import {RenderPosition} from "../utils/render";
import {createOffersArray} from "../mock/selector";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  startDate: null,
  endDate: null,
  type: `Bus`,
  info: {
    city: ``,
    description: [],
    photo: []
  },
  price: 0,
  offers: createOffersArray(`Bus`, 5, false)
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

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._eventEditComponent.getData();
      this._onDataChange(event, data);
    });
    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      if (this._mode !== Mode.ADDING) {
        this._onDataChange(event, null);
      } else {
        this._onDataChange(EmptyEvent, null);
      }
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent);
        }
        break;
      case Mode.ADDING:
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
