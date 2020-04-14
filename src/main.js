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

const events = generateEvents(EVENTS_COUNT).slice().sort((a, b) => a.startDate.getDate() - b.startDate.getDate());
const totalPrice = getTotalPrice(events);


const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TrailComponent(getTrail(events), getNoRepeatingDates(events)).getElement(), RenderPosition.AFTERBEGIN);

const tripMainInfoElement = document.querySelector(`.trip-main__trip-info`);
render(tripMainInfoElement, new TotalPriceComponent(totalPrice).getElement());


const tripMainControlsElement = document.querySelector(`.trip-main__trip-controls`);
const tripMainControlsHeader = tripMainControlsElement.querySelector(`.visually-hidden`);
render(tripMainControlsHeader, new TripControlsComponent().getElement(), RenderPosition.AFTEREND);
render(tripMainControlsElement, new FiltersComponent().getElement());


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
  if (!allEvents) {
    render(element, new NoEventsComponent().getElement());
  } else {
    render(element, new SortingComponent().getElement());

    const tripDaysContainer = new TripDaysContainerComponent();
    render(element, tripDaysContainer.getElement());

    const tripDaysElement = tripDaysContainer.getElement();
    const daysItem = new DaysItemComponent(getNoRepeatingDates(allEvents));
    render(tripDaysElement, daysItem.getElement());

    const tripEventsList = daysItem.getElement().querySelectorAll(`.trip-events__list`);

    for (let j = 0; j < tripEventsList.length; j++) {
      for (let i = 0; i < allEvents.length; i++) {
        if (allEvents[i].startDate.getDate() === getNoRepeatingDates(allEvents)[j].day) {
          renderEvent(tripEventsList[j], allEvents[i]);
        }
      }
    }
  }
};

const tripEventsElement = document.querySelector(`.trip-events`);
renderBoard(tripEventsElement, events);
