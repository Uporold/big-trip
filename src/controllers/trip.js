import {render, replace} from "../utils/render";
import {getNoRepeatingDates} from "../utils/time";
import EventComponent from "../components/event";
import TripFormComponent from "../components/form";
import NoEventsComponent from "../components/no-events";
import SortingComponent from "../components/trip-sorting";
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
      const daysItem = new DaysItemComponent(trailDates);
      render(tripDaysElement, daysItem);

      const tripEventsList = daysItem.getElement().querySelectorAll(`.trip-events__list`);

      for (let j = 0; j < tripEventsList.length; j++) {
        const dayEvents = events.filter((event) => event.startDate.getDate() === trailDates[j].day);
        dayEvents.forEach((event) => renderEvent(tripEventsList[j], event));
      }
    }
  }
}

