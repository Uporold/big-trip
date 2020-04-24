import {render} from "../utils/render";
import {getNoRepeatingDates} from "../utils/time";
import EventController from "./event";
import NoEventsComponent from "../components/no-events";
import SortingComponent, {SortType} from "../components/trip-sorting";
import TripDaysContainerComponent from "../components/days-container";
import DaysItemComponent from "../components/days-item";


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

const renderEvents = (events, container, onDataChange, onViewChange, points) => {
  return events.map((event) => {
    const eventController = new EventController(container, onDataChange, onViewChange, points);
    eventController.render(event);

    return eventController;
  });
};

const renderDefaultEvents = (events, trailDates, container, onDataChange, onViewChange, points) => {
  const tripEventsList = getDaysContainer(container, trailDates);
  let controllers = [];
  for (let j = 0; j < tripEventsList.length; j++) {
    const dayEvents = events.filter((event) => event.startDate.getDate() === trailDates[j].day);
    controllers = [...controllers, ...renderEvents(dayEvents, tripEventsList[j], onDataChange, onViewChange, points)];
  }
  return controllers;
};

const renderSortedEvents = (sortedEvents, container, onDataChange, onViewChange, points) => {
  const tripEventsList = getDaysContainer(container);
  return renderEvents(sortedEvents, tripEventsList, onDataChange, onViewChange, points);
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._showedEventControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysContainer = new TripDaysContainerComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onViewChange = this._onViewChange.bind(this);

  }

  render(events, points) {
    const container = this._container;
    this._events = events;
    this._points = points;
    this._trailDates = getNoRepeatingDates(this._events);
    if (!this._events.length) {
      render(container, this._noEventsComponent);
    } else {
      render(container, this._sortingComponent);
      render(container, this._tripDaysContainer);

      const tripDaysElement = this._tripDaysContainer.getElement();
      this._showedEventControllers = renderDefaultEvents(this._events, this._trailDates, tripDaysElement, this._onDataChange, this._onViewChange, this._points);
    }
  }
  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._events, sortType);
    const tripDaysElement = this._tripDaysContainer.getElement();
    if (sortType !== `event`) {
      this._showedEventControllers = renderSortedEvents(sortedEvents, tripDaysElement, this._onDataChange, this._onViewChange, this._points);
    } else {
      this._showedEventControllers = renderDefaultEvents(this._events, this._trailDates, tripDaysElement, this._onDataChange, this._onViewChange, this._points);
    }
  }

  _onDataChange(oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);
    const eventController = this._showedEventControllers.find((evt) => evt._eventComponent._event === oldData);
    if (index === -1) {
      return;
    }

    this._events = [...this._events.slice(0, index), newData, ...this._events.slice(index + 1)];
    eventController.render(this._events[index]);

  }

  _onViewChange() {
    this._showedEventControllers.forEach((it) => it.setDefaultView());
  }
}

