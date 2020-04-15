import TrailComponent from "./components/trip-info";
import TotalPriceComponent from "./components/total-price";
import TripControlsComponent from "./components/controls";
import FiltersComponent from "./components/filters";
import SortingComponent from "./components/trip-sorting";
import TripDaysContainerComponent from "./components/days-container";
import DaysItemComponent from "./components/days-item";
import EventComponent from "./components/event";
import TripFormComponent from "./components/form";
import NoEventsComponent from "./components/no-events";
import {generateEvents} from "./mock/event";
import {getTotalPrice, getTrail, getNoRepeatingDates, render, RenderPosition} from "./utils";


const EVENTS_COUNT = 20;

const events = generateEvents(EVENTS_COUNT).slice().sort((a, b) => a.startDate - b.startDate);
const trail = getTrail(events);
const trailDates = getNoRepeatingDates(events);
const totalPrice = getTotalPrice(events);


const tripMainElement = document.querySelector(`.trip-main`);
const trailComponent = new TrailComponent(trail, trailDates);
render(tripMainElement, trailComponent.getElement(), RenderPosition.AFTERBEGIN);

const tripMainInfoElement = document.querySelector(`.trip-main__trip-info`);
const totalPriceComponent = new TotalPriceComponent(totalPrice);
render(tripMainInfoElement, totalPriceComponent.getElement());


const tripMainControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripMainControlsHeader = tripMainControlsElement.querySelector(`.visually-hidden`);
const tripControlsComponent = new TripControlsComponent();
render(tripMainControlsHeader, tripControlsComponent.getElement(), RenderPosition.AFTEREND);

const filterComponent = new FiltersComponent();
render(tripMainControlsElement, filterComponent.getElement());


const renderEvent = (eventListElement, event) => {
  const replaceEventToEdit = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceEditToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventComponent = new EventComponent(event);
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new TripFormComponent(event);
  const editForm = eventEditComponent.getElement();
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editForm.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent.getElement());
};

const renderBoard = (element, allEvents) => {
  if (!allEvents.length) {
    const noEventsComponent = new NoEventsComponent();
    render(element, noEventsComponent.getElement());
  } else {
    const sortingComponent = new SortingComponent();
    render(element, sortingComponent.getElement());

    const tripDaysContainer = new TripDaysContainerComponent();
    render(element, tripDaysContainer.getElement());

    const tripDaysElement = tripDaysContainer.getElement();
    const daysItem = new DaysItemComponent(trailDates);
    render(tripDaysElement, daysItem.getElement());

    const tripEventsList = daysItem.getElement().querySelectorAll(`.trip-events__list`);

    for (let j = 0; j < tripEventsList.length; j++) {
      const dayEvents = allEvents.filter((event) => event.startDate.getDate() === trailDates[j].day);
      dayEvents.forEach((event) => renderEvent(tripEventsList[j], event));
    }
  }
};

const tripEventsElement = document.querySelector(`.trip-events`);
renderBoard(tripEventsElement, events);
