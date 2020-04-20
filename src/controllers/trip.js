import {render, replace} from "../utils/render";
import {getNoRepeatingDates} from "../utils/time";
import EventComponent from "../components/event";
import TripFormComponent from "../components/form";
import NoEventsComponent from "../components/no-events";
import SortingComponent, {SortType} from "../components/trip-sorting";
import TripDaysContainerComponent from "../components/days-container";
import DaysItemComponent from "../components/days-item";

const renderEvent = (eventListElement, event) => {
  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventComponent = new EventComponent(event);
  eventComponent.setArrowHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new TripFormComponent(event);
  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setArrowHandler(() => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent);
};

const getSortedEvents = (events, sortType) => {
  const showingEvents = events.slice();

  switch (sortType) {
    case SortType.PRICE:
      showingEvents.sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      showingEvents.sort((a, b) => (b.endDate - b.startDate) - (a.endDate - a.startDate));
      break;
  }

  return showingEvents;
};

const getDaysContainer = (container, dates = ``) => {
  container.innerHTML = ``;
  const daysItem = new DaysItemComponent(dates);
  if (dates === ``) {
    daysItem.getElement().querySelector(`.day__info`).innerHTML = ``;
  }
  render(container, daysItem);

  return dates !== `` ? daysItem.getElement().querySelectorAll(`.trip-events__list`) : daysItem.getElement().querySelector(`.trip-events__list`);
};

const renderEvents = (events, container) => {
  events.forEach((event) => renderEvent(container, event));
};

const renderDefaultEvents = (events, trailDates, container) => {
  document.querySelector(`.trip-sort__item--day`).textContent = `Day`;
  const tripEventsList = getDaysContainer(container, trailDates);
  for (let j = 0; j < tripEventsList.length; j++) {
    const dayEvents = events.filter((event) => event.startDate.getDate() === trailDates[j].day);
    renderEvents(dayEvents, tripEventsList[j]);
  }
};

const renderSortedEvents = (sortedEvents, container) => {
  document.querySelector(`.trip-sort__item--day`).textContent = ``;
  const tripEventsList = getDaysContainer(container);
  renderEvents(sortedEvents, tripEventsList);
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysContainer = new TripDaysContainerComponent();
  }

  render(events) {
    const container = this._container;
    const trailDates = getNoRepeatingDates(events);
    if (!events.length) {
      render(container, this._noEventsComponent);
    } else {
      render(container, this._sortingComponent);
      render(container, this._tripDaysContainer);

      const tripDaysElement = this._tripDaysContainer.getElement();
      renderDefaultEvents(events, trailDates, tripDaysElement);

      this._sortingComponent.setSortTypeChangeHandler((sortType) => {
        const sortedEvents = getSortedEvents(events, sortType);
        if (sortType !== `event`) {
          renderSortedEvents(sortedEvents, tripDaysElement);
        } else {
          renderDefaultEvents(events, trailDates, tripDaysElement);
        }
      });
    }
  }
}

