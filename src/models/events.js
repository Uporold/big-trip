import {getEventsByFilter} from "../utils/filter";
import {FilterType} from "../const";

export default class Events {
  constructor() {
    this._events = [];
    this._offers = [];
    this._destinations = [];
    this._dataChangeHandlers = [];

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterChangeHandlers = [];
  }

  getEvents(filterType = this._activeFilterType) {
    return getEventsByFilter(this._events, filterType);
  }

  getEventsAll() {
    return this._events;
  }

  getOffers() {
    return this._offers;
  }

  setOffers(offers) {
    this._offers = Array.from(offers);
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(destinations) {
    this._destinations = Array.from(destinations);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
