import {tripFilters} from "../const";
import AbstractComponent from "./abstract-component";

const createTripFilterMarkup = (filter, index) => {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filter.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.toLowerCase()}" ${index === 0 ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filter.toLowerCase()}">${filter}</label>
    </div>`
  );
};

const createTripFiltersTemplate = () => {
  const filterMarkup = tripFilters.map((it, index) => createTripFilterMarkup(it, index)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
        ${filterMarkup}
        <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`
  );
};

export default class Filters extends AbstractComponent {
  getTemplate() {
    return createTripFiltersTemplate();
  }
}