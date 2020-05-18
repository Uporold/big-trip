import Event from "../models/event";
import {URL} from "../const";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Code = {
  SUCCESS: 200,
  REDIRECTION: 300
};

const checkStatus = (response) => {
  if (response.status >= Code.SUCCESS && response.status < Code.REDIRECTION) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getEvents() {
    return this._load({url: URL.POINTS})
      .then((response) => response.json())
      .then(Event.parseEvents);
  }

  getOffers() {
    return this._load({url: URL.OFFERS})
      .then((response) => response.json());
  }

  getDestinations() {
    return this._load({url: URL.DESTINATIONS})
      .then((response) => response.json());
  }

  sync(data) {
    return this._load({
      url: `${URL.POINTS}/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  updateEvent(id, data) {
    return this._load({
      url: `${URL.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  createEvent(event) {
    return this._load({
      url: URL.POINTS,
      method: Method.POST,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parseEvent);
  }

  deleteEvent(id) {
    return this._load({url: `${URL.POINTS}/${id}`, method: Method.DELETE});
  }
}

