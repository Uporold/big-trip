import {createTripInfoTemplate} from "./components/trip-info-template";
import {createTripPriceTemplate} from "./components/trip-price-template";
import {createTripControlsNavTemplate} from "./components/trip-controls-nav-template";
import {createTripFiltersTemplate} from "./components/trip-filters-template";
import {createTripSortingTemplate} from "./components/trip-sorting-template";
import {createTripFormTemplate} from "./components/trip-form-template";
import {createTripFormEventDetailsContainerTemplate} from "./components/trip-form-event-details-container-template";
import {createTripFormEventOffersTemplate} from "./components/trip-form-event-offers-template";
import {createTripFormEventDestinationTemplate} from "./components/trip-form-event-destination-template";
import {createTripDaysContainerTemplate} from "./components/trip-days-container-template";
import {createTripDaysItemTemplate} from "./components/trip-days-item-template";
import {createTripEventTemplate} from "./components/trip-event-template";

const EVENTS_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripMainInfoElement = document.querySelector(`.trip-main__trip-info`);
render(tripMainInfoElement, createTripPriceTemplate());

const tripMainControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripMainControlsHeader = tripMainControlsElement.querySelector(`.visually-hidden`);

render(tripMainControlsHeader, createTripControlsNavTemplate(), `afterEnd`);
render(tripMainControlsElement, createTripFiltersTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createTripSortingTemplate());
render(tripEventsElement, createTripFormTemplate());

const tripEventsItemElement = document.querySelector(`.trip-events__item`);
render(tripEventsItemElement, createTripFormEventDetailsContainerTemplate());

const tripEventsDetailsElement = document.querySelector(`.event__details`);
render(tripEventsDetailsElement, createTripFormEventOffersTemplate());
render(tripEventsDetailsElement, createTripFormEventDestinationTemplate());

render(tripEventsElement, createTripDaysContainerTemplate());
const tripDaysElement = document.querySelector(`.trip-days`);
render(tripDaysElement, createTripDaysItemTemplate());

const tripEventsList = document.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsList, createTripEventTemplate());
}


