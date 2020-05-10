import AbstractComponent from "./abstract-component";

const createOfferSelectorMarkup = (offer, selectedOffers) => {
  const isChecked = () => selectedOffers.some((selectedOffer) => selectedOffer.title === offer.title) ? `checked` : ``;
  return (
    ` <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}-1" type="checkbox" name="event-offer" ${isChecked()} value="${offer.title}">
        <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
    </div>`
  );
};

const createTripFormEventOffersTemplate = (allOffers, offers) => {
  const selectorMarkup = allOffers.map((offer) => createOfferSelectorMarkup(offer, offers)).join(`\n`);

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
  constructor(selectors, offers) {
    super();
    this._selectors = selectors;
    this._offers = offers;
  }

  getTemplate() {
    return createTripFormEventOffersTemplate(this._selectors, this._offers);
  }
}
