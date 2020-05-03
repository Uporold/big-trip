import AbstractComponent from "./abstract-component";

const createTripDaysContainerTemplate = () => {
  return (
    `<section class="trip-main__trip-info  trip-info"></section>`
  );
};

export default class TripInfoContainer extends AbstractComponent {
  getTemplate() {
    return createTripDaysContainerTemplate();
  }
}
