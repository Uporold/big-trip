import {render} from "../utils/render";
import {getNoRepeatingDates} from "../utils/time";
import EventController, {Mode as EventControllerMode, EmptyEvent} from "./event";
import NoEventsComponent from "../components/no-events";
import SortingComponent, {SortType} from "../components/trip-sorting";
import TripDaysContainerComponent from "../components/days-container";
import DaysItemComponent from "../components/days-item";
import {FilterType} from "../const";

const HIDDEN_CLASS = `visually-hidden`;
const getSortedEvents = (events, sortType) => {
  const showingEvents = events.slice();

  switch (sortType) {
    case SortType.PRICE:
      showingEvents.sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      showingEvents.sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
      break;
  }

  return showingEvents;
};

const getDaysContainer = (container, dates = ``) => {
  container.innerHTML = ``;
  const daysItem = new DaysItemComponent(dates);
  if (dates === ``) {
    daysItem.getElement().querySelector(`.day__info`).innerHTML = ``;
  }
  render(container, daysItem);

  return dates !== `` ? daysItem.getElement().querySelectorAll(`.trip-events__list`) : daysItem.getElement().querySelector(`.trip-events__list`);
};

const renderEvents = (events, container, onDataChange, onViewChange, points, types) => {
  return events.map((event) => {
    const eventController = new EventController(container, onDataChange, onViewChange, points, types);
    eventController.render(event, EventControllerMode.DEFAULT);

    return eventController;
  });
};

const renderDefaultEvents = (events, trailDates, container, onDataChange, onViewChange, points, types) => {
  const tripEventsList = getDaysContainer(container, trailDates);
  let controllers = [];
  for (let j = 0; j < tripEventsList.length; j++) {
    const dayEvents = events.filter((event) => event.startDate.getDate() === trailDates[j].day);
    controllers = [...controllers, ...renderEvents(dayEvents, tripEventsList[j], onDataChange, onViewChange, points, types)];
  }
  return controllers;
};

const renderSortedEvents = (sortedEvents, container, onDataChange, onViewChange, points, types) => {
  const tripEventsList = getDaysContainer(container);
  return renderEvents(sortedEvents, tripEventsList, onDataChange, onViewChange, points, types);
};

export default class TripController {
  constructor(container, eventsModel, filterController, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._showedEventControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysContainer = new TripDaysContainerComponent();
    this._creatingEvent = null;
    this._sortType = SortType.EVENT;
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
    this._filterController = filterController;
    this._api = api;
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  render(points, types) {
    const container = this._container;
    const events = this._eventsModel.getEvents();
    this._points = points;
    this._types = types;
    this._trailDates = getNoRepeatingDates(events);
    if (!events.length) {
      render(container, this._noEventsComponent);
    } else {
      render(container, this._sortingComponent);
      render(container, this._tripDaysContainer);

      const tripDaysElement = this._tripDaysContainer.getElement();
      this._showedEventControllers = renderDefaultEvents(events, this._trailDates, tripDaysElement, this._onDataChange, this._onViewChange, this._points, this._types);
    }
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    const tripDaysElement = this._tripDaysContainer.getElement();
    this._creatingEvent = new EventController(tripDaysElement, this._onDataChange, this._onViewChange, this._points, this._types);
    this._filterController.setDefaultFilter();
    this._showedEventControllers = [].concat(this._creatingEvent, this._showedEventControllers);
    this._creatingEvent.render(EmptyEvent, EventControllerMode.ADDING);
    this._creatingEvent = null;
  }

  _removeEvents() {
    this._showedEventControllers.forEach((eventController) => eventController.destroy());
    this._showedEventControllers = [];
  }

  _updateEvents() {
    this._removeEvents();
    this._onSortTypeChange(this._sortType);
    if (!this._eventsModel.getEvents(FilterType.EVERYTHING).length) {
      render(this._container, this._noEventsComponent);
    }
  }

  _onSortTypeChange(sortType) {
    const trailDates = getNoRepeatingDates(this._eventsModel.getEvents());
    const sortedEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);
    const tripDaysElement = this._tripDaysContainer.getElement();
    this._showedEventControllers = renderDefaultEvents(this._eventsModel.getEvents(), trailDates, tripDaysElement, this._onDataChange, this._onViewChange, this._points, this._types);
    if (sortType !== `event`) {
      this._sortType = sortType;
      this._showedEventControllers = renderSortedEvents(sortedEvents, tripDaysElement, this._onDataChange, this._onViewChange, this._points, this._types);
    } else {
      this._sortType = sortType;
      this._showedEventControllers = renderDefaultEvents(this._eventsModel.getEvents(), trailDates, tripDaysElement, this._onDataChange, this._onViewChange, this._points, this._types);
    }
  }

  _onDataChange(oldData, newData) {
    const eventController = this._showedEventControllers.find((evt) => evt._eventComponent._event === oldData);
    if (oldData === EmptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        eventController.destroy();
        // this._updateEvents();
      } else {
        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            eventController.render(eventModel, EventControllerMode.DEFAULT);
            this._showedEventControllers = [].concat(eventController, this._showedEventControllers);
            this._updateEvents();
            this._filterController.setDefaultFilter();
          })
          .catch(() => {
            eventController.shake();
          });

      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          this._updateEvents();
        })
        .catch(() => {
          eventController.shake();
        });
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((eventModel) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);

          if (isSuccess) {
            eventController.render(eventModel, EventControllerMode.DEFAULT);
            // this._updateEvents();
          }
        })
        .catch(() => {
          eventController.shake();
        });
    }
    // this._updateEvents();
  }


  _onViewChange() {
    this._showedEventControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._sortingComponent.setActiveItem(SortType.EVENT);
    this._sortType = SortType.EVENT;
    this._updateEvents();
  }
}

