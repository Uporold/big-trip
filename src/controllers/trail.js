import {render, replace} from "../utils/render";
import TrailComponent from "../components/trip-info";
import {getTrail} from "../utils/trail-info";
import {getNoRepeatingDates} from "../utils/time";
import {RenderPosition} from "../utils/render";

export default class TrailController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._trailComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const oldComponent = this._trailComponent;
    const events = this._eventsModel.getEvents();
    const trail = getTrail(events);
    const trailDates = getNoRepeatingDates(events);


    this._trailComponent = new TrailComponent(trail, trailDates);

    if (oldComponent) {
      replace(this._trailComponent, oldComponent);
    } else {
      render(container, this._trailComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
