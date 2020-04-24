import AbstractComponent from "./abstract-component";

const createOfferSelectorMarkup = (name, price, title) => {
  return (
    ` <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${name ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${name}-1">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
    </div>`
  );
};

const createTripFormEventOffersTemplate = (selectors) => {
  const selectorMarkup = selectors.map((it) => createOfferSelectorMarkup(it.name, it.price, it.title)).join(`\n`);

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${selectorMarkup}
      </div>
    </section>`
  );
};

export default class Offers extends AbstractComponent {
  constructor(selectors) {
    super();
    this._selectors = selectors;
  }

  getTemplate() {
    return createTripFormEventOffersTemplate(this._selectors);
  }
}
