import {descriptions, photos} from "../const";

const createPhotosMarkup = (photo) => {
  return (
    `<img class="event__photo" src="${photo}" alt="Event photo">`
  );
};

export const createTripFormEventDestinationTemplate = (description = descriptions, photo = photos) => {
  const photosMarkup = photo.map((it) => createPhotosMarkup(it)).join(`\n`);
  const descriptionMarkup = description.map((it) => it).join(` `);
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${descriptionMarkup}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosMarkup}
        </div>
      </div>
    </section>`
  );
};
