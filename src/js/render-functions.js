import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

let lightbox;

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" width="360" height="200" />
      </a>
      <ul class="gallery-info">
        <li class="info-block">
          <p class="label">Likes</p>
          <p class="value">${likes}</p>
        </li>
        <li class="info-block">
          <p class="label">Views</p>
          <p class="value">${views}</p>
        </li>
        <li class="info-block">
          <p class="label">Comments</p>
          <p class="value">${comments}</p>
        </li>
        <li class="info-block">
          <p class="label">Downloads</p>
          <p class="value">${downloads}</p>
        </li>
      </ul>
    </li>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.remove('is-hidden');
}

export function hideLoader() {
  loader.classList.add('is-hidden');
}
