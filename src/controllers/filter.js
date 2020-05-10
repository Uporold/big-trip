import FilterComponent from "../components/filters";
import {FilterType} from "../const";
import {render, replace} from "../utils/render";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    Object.values(FilterType).map((filterType) => {
      if (!this._eventsModel.getEvents(filterType).length) {
        this._filterComponent.disableItem(filterType);
      }
    });

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent);
    }
  }

  _onFilterChange(filterType) {
    switch (filterType) {
      case FilterType.EVERYTHING:
        this._eventsModel.setFilter(filterType);
        this._activeFilterType = filterType;
        break;
      case FilterType.FUTURE:
        if (this._eventsModel.getEvents(filterType).length) {
          this._eventsModel.setFilter(filterType);
          this._activeFilterType = filterType;
        }
        break;
      case FilterType.PAST:
        if (this._eventsModel.getEvents(filterType).length) {
          this._eventsModel.setFilter(filterType);
          this._activeFilterType = filterType;
        }
        break;
    }
  }


  setDefaultFilter() {
    this._eventsModel.setFilter(FilterType.EVERYTHING);
    this._filterComponent.setActiveItem(FilterType.EVERYTHING);
  }

  _onDataChange() {
    this.render();
  }


}
