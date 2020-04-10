import {createTripInfoTemplate} from "./components/trip-info-template";
import {createTripPriceTemplate} from "./components/trip-price-template";
import {createTripControlsNavTemplate} from "./components/trip-controls-nav-template";
import {createTripFiltersTemplate} from "./components/trip-filters-template";
import {createTripSortingTemplate} from "./components/trip-sorting-template";
import {createTripFormTemplate} from "./components/trip-form-template";
import {createTripDaysContainerTemplate} from "./components/trip-days-container-template";
import {createTripDaysItemTemplate} from "./components/trip-days-item-template";
import {createTripEventTemplate} from "./components/trip-event-template";
import {generateEvents} from "./mock/event";
import {getTotalPrice, getTrail} from "./utils";

const EVENTS_COUNT = 20;

const events = generateEvents(EVENTS_COUNT);
const totalPrice = getTotalPrice(events);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(getTrail(events)), `afterbegin`);

const tripMainInfoElement = document.querySelector(`.trip-main__trip-info`);
render(tripMainInfoElement, createTripPriceTemplate(totalPrice));

const tripMainControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripMainControlsHeader = tripMainControlsElement.querySelector(`.visually-hidden`);

render(tripMainControlsHeader, createTripControlsNavTemplate(), `afterEnd`);
render(tripMainControlsElement, createTripFiltersTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createTripSortingTemplate());
render(tripEventsElement, createTripFormTemplate());

render(tripEventsElement, createTripDaysContainerTemplate());
const tripDaysElement = document.querySelector(`.trip-days`);
render(tripDaysElement, createTripDaysItemTemplate());

const tripEventsList = document.querySelector(`.trip-events__list`);

render(tripEventsList, createTripEventTemplate(events[0], true));
for (let i = 1; i < events.length; i++) {
  render(tripEventsList, createTripEventTemplate(events[i]));
}


