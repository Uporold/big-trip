export default class Event {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.destination = data.destination;
    this.price = data[`base_price`];
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.offers = data[`offers`];
    this.isFavorite = Boolean(data[`is_favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "destination": this.destination,
      "base_price": this.price,
      "date_from": this.startDate.toJSON(),
      "date_to": this.endDate.toJSON(),
      "offers": this.offers,
      "is_favorite": this.isFavorite,

    };
  }

  static parseEvent(data) {
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}
