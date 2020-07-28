import AbstractComponent from "./abstract-component";

const createTripControlsNavTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" id="table">Table</a>
      <a class="trip-tabs__btn" href="#" id="stats">Stats</a>
     </nav>`
  );
};

export default class Controls extends AbstractComponent {
  getTemplate() {
    return createTripControlsNavTemplate();
  }

  setModeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      if (evt.target.classList.contains(`trip-tabs__btn--active`)) {
        return;
      }

      document.querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);

      evt.target.classList.add(`trip-tabs__btn--active`);
      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }
}
