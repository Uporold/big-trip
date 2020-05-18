import TotalPriceController from "./controllers/total-price-controller";
import TrailController from "./controllers/trail-controller";
import TripControlsComponent from "./components/controls";
import FilterController from "./controllers/filter-controller";
import TripInfoContainer from "./components/trip-info-container";
import TripController from "./controllers/trip-controller";
import EventsModel from "./models/events";
import StatisticsComponent from "./components/statistics";
import Loading from "./components/loading";
import API from "./api/index.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import {render, RenderPosition, remove} from "./utils/render";
import {FilterType, MenuItem} from "./const";

const AUTHORIZATION = `Basic orezoreyqAzWsXeDcRfVTgBYhNUjM=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripMainControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripMainControlsHeader = tripMainControlsElement.querySelector(`.visually-hidden`);
const tripEventsElement = document.querySelector(`.trip-events`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);

const api = new API(AUTHORIZATION, END_POINT);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const eventsModel = new EventsModel();
const tripControlsComponent = new TripControlsComponent();
const filterController = new FilterController(tripMainControlsElement, eventsModel);
const loadingComponent = new Loading();
const trip = new TripController(tripEventsElement, eventsModel, filterController, apiWithProvider);
const statisticsComponent = new StatisticsComponent(eventsModel);

const tripInfoContainer = new TripInfoContainer();
render(tripMainElement, tripInfoContainer, RenderPosition.AFTERBEGIN);

const tripMainInfoElement = document.querySelector(`.trip-main__trip-info`);
const trailController = new TrailController(tripMainInfoElement, eventsModel);
const totalPriceController = new TotalPriceController(tripMainInfoElement, eventsModel);
trailController.render();
totalPriceController.render();

render(tripMainControlsHeader, tripControlsComponent, RenderPosition.AFTEREND);
filterController.render();
render(tripEventsElement, loadingComponent);
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

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  trip.createEvent();
});

apiWithProvider.getEvents()
  .then((items) => {
    eventsModel.setEvents(items);
    apiWithProvider.getOffers()
      .then((offers) => {
        eventsModel.setOffers(offers);
        apiWithProvider.getDestinations()
          .then((result) => {
            eventsModel.setDestinations(result);
            trip.render(eventsModel.getDestinations(), eventsModel.getOffers());
            remove(loadingComponent);
          });
      });
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
