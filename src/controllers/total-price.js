import {render, replace} from "../utils/render";
import TotalPriceComponent from "../components/total-price";
import {getTotalPrice} from "../utils/trail-info";

export default class TotalPriceController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._totalPriceComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const oldComponent = this._totalPriceComponent;
    const events = this._eventsModel.getEventsAll();
    const totalPrice = getTotalPrice(events);

    this._totalPriceComponent = new TotalPriceComponent(totalPrice);

    if (oldComponent) {
      replace(this._totalPriceComponent, oldComponent);
    } else {
      render(container, this._totalPriceComponent);
    }
  }

  _onDataChange() {
    this.render();
  }
}
