import TotalPriceController from "./controllers/total-price";
import TrailController from "./controllers/trail";
import TripControlsComponent from "./components/controls";
import FilterController from "./controllers/filter";
import TripInfoContainer from "./components/trip-info-container";
import TripController from "./controllers/trip";
import EventsModel from "./models/points";
import StatisticsComponent from "./components/statistics";
import Loading from "./components/loading";
import API from "./api/index.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import {render, RenderPosition, remove} from "./utils/render";
import {FilterType, MenuItem} from "./const";

const AUTHORIZATION = `Basic orezqAzWsXeDcRfVTgBYhNUjM=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(AUTHORIZATION, END_POINT);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);


const eventsModel = new EventsModel();

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
const loadingComponent = new Loading();
render(tripEventsElement, loadingComponent);
const trip = new TripController(tripEventsElement, eventsModel, filterController, apiWithProvider);

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

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  // filterController.setDefaultFilter();
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
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
    // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
