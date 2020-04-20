import AbstractComponent from "./abstract-component";

const createTripPriceTemplate = (sum) => {
  return (
    `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
     </p>`
  );
};

export default class TotalPrice extends AbstractComponent {
  constructor(sum) {
    super();
    this._sum = sum;
  }

  getTemplate() {
    return createTripPriceTemplate(this._sum);
  }
}
