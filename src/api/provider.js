import Point from "../models/point";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.event);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map((event) => event.toRAW()));

          this._store.setItems(items);

          return events;
        });
    }

    const storeItems = Object.values(this._store.getItems());

    return Promise.resolve(Point.parseEvents(storeItems));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers, `offers`);

          return offers;
        });
    }

    return Promise.resolve(this._store.getItems(`offers`));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations, `destinations`);

          return destinations;
        });
    }

    return Promise.resolve(this._store.getItems(`destinations`));
  }

  createEvent(event) {
    if (isOnline()) {
      return this._api.createEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }
    const localNewEventId = nanoid();
    const localNewEvent = Point.clone(Object.assign(event, {id: localNewEventId}));

    this._store.setItem(localNewEvent.id, localNewEvent.toRAW());

    return Promise.resolve(localNewEvent);
  }

  updateEvent(id, event) {
    if (isOnline()) {
      return this._api.updateEvent(id, event)
    .then((updatedEvent) => {
      this._store.setItem(updatedEvent.id, updatedEvent.toRAW());

      return updatedEvent;
    });
    }
    const localItem = Point.clone(Object.assign(event, {id}));

    this._store.setItem(id, localItem.toRAW());

    return Promise.resolve(localItem);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
