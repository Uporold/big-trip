import TotalPriceController from "./controllers/total-price";
import TrailController from "./controllers/trail";
import TripControlsComponent from "./components/controls";
import FilterController from "./controllers/filter";
import TripInfoContainer from "./components/trip-info-container";
import TripController from "./controllers/trip";
import EventsModel from "./models/points";
import StatisticsComponent from "./components/statistics";
import {generatePointInfo} from "./mock/point-info";
import {generateOffers} from "./mock/selector";
import {generateEvents} from "./mock/event";
import {render, RenderPosition} from "./utils/render";
import {FilterType, MenuItem} from "./const";


const EVENTS_COUNT = 5;
const points = generatePointInfo();
const offers = generateOffers();
const events = generateEvents(EVENTS_COUNT, points, offers).slice().sort((a, b) => a.startDate - b.startDate);
const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoContainer = new TripInfoContainer();
render(tripMainElement, tripInfoContainer, RenderPosition.AFTERBEGIN);

const tripMainInfoElement = document.querySelector(`.trip-main__trip-info`);
const trailController = new TrailController(tripMainInfoElement, eventsModel);
trailController.render();


const totalPriceController = new TotalPriceController(tripMainInfoElement, eventsModel);
totalPriceController.render();

const tripMainControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripMainControlsHeader = tripMainControlsElement.querySelector(`.visually-hidden`);
const tripControlsComponent = new TripControlsComponent();
render(tripMainControlsHeader, tripControlsComponent, RenderPosition.AFTEREND);

const filterController = new FilterController(tripMainControlsElement, eventsModel);
filterController.render();

const tripEventsElement = document.querySelector(`.trip-events`);
const trip = new TripController(tripEventsElement, eventsModel);
trip.render(points, offers);

const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);
const statisticsComponent = new StatisticsComponent(eventsModel);
render(pageBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

tripControlsComponent.setModeChangeHandler((menuItem) => {
  eventsModel.setFilter(FilterType.EVERYTHING);
  filterController.setDefaultFilter();
  switch (menuItem) {
    case MenuItem.STATS:
      pageBodyContainer.style.setProperty(`--after`, `none`);
      trip.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      pageBodyContainer.style.setProperty(`--after`, ``);
      statisticsComponent.hide();
      trip.show();
      break;
  }
});

