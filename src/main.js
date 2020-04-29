import TrailComponent from "./components/trip-info";
import TotalPriceComponent from "./components/total-price";
import TripControlsComponent from "./components/controls";
import FilterController from "./controllers/filter";
import {generateEvents} from "./mock/event";
import {getTotalPrice, getTrail} from "./utils/trail-info";
import {getNoRepeatingDates} from "./utils/time";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip";
import {generatePointInfo} from "./mock/point-info";
import {generateOffers} from "./mock/selector";
import EventsModel from "./models/points";

const EVENTS_COUNT = 20;
const points = generatePointInfo();
const offers = generateOffers();
const events = generateEvents(EVENTS_COUNT, points, offers).slice().sort((a, b) => a.startDate - b.startDate);
const eventsModel = new EventsModel();
eventsModel.setEvents(events);
const trail = getTrail(events);
const trailDates = getNoRepeatingDates(events);
const totalPrice = getTotalPrice(events);


const tripMainElement = document.querySelector(`.trip-main`);
const trailComponent = new TrailComponent(trail, trailDates);
render(tripMainElement, trailComponent, RenderPosition.AFTERBEGIN);

const tripMainInfoElement = document.querySelector(`.trip-main__trip-info`);
const totalPriceComponent = new TotalPriceComponent(totalPrice);
render(tripMainInfoElement, totalPriceComponent);

const tripMainControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripMainControlsHeader = tripMainControlsElement.querySelector(`.visually-hidden`);
const tripControlsComponent = new TripControlsComponent();
render(tripMainControlsHeader, tripControlsComponent, RenderPosition.AFTEREND);

const filterController = new FilterController(tripMainControlsElement, eventsModel);
filterController.render();

const tripEventsElement = document.querySelector(`.trip-events`);
const trip = new TripController(tripEventsElement, eventsModel);
trip.render(points, offers);

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  trip.createEvent();
});
