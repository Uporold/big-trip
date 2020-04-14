import {createElement} from "../utils";

const createTripPriceTemplate = (sum) => {
  return (
    `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
     </p>`
  );
};

export default class TotalPrice {
  constructor(sum) {
    this._sum = sum;
    this._element = null;
  }

  getTemplate() {
    return createTripPriceTemplate(this._sum);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
