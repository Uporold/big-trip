import AbstractComponent from "./abstract-component";

const createTripDaysContainerTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class DaysContainer extends AbstractComponent {
  getTemplate() {
    return createTripDaysContainerTemplate();
  }
}
