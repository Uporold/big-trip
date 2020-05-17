import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createTripFilterMarkup = (filter, checked) => {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filter.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.toLowerCase()}" ${checked ? `checked` : ``}>
      <label id="${filter.toLowerCase()}" class="trip-filters__filter-label" for="filter-${filter.toLowerCase()}">${filter}</label>
    </div>`
  );
};

const createTripFiltersTemplate = (filters) => {
  const filterMarkup = filters.map((it) => createTripFilterMarkup(it.name, it.checked)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
        ${filterMarkup}
        <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters);
  }

  setActiveItem(filter) {
    const item = this.getElement().querySelector(`#filter-${filter}`);

    if (item) {
      item.checked = true;
    }
  }

  switchFilterAvailability(filter, isDisabled, style) {
    const item = this.getElement().querySelector(`#filter-${filter}`);

    if (item) {
      item.disabled = isDisabled;
      this.getElement().querySelector(`#${filter}`).style = style;
    }
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
