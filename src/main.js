import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const loadMoreButton = document.querySelector('.load-more');

  let query = '';
  let page = 1;
  let totalHits = 0;
  const PER_PAGE = 15;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const searchInput = e.currentTarget.elements['search-text'];
    if (!searchInput) return;

    query = searchInput.value.trim();
    if (!query) {
      iziToast.error({
        message: 'Please enter a search query!',
        position: 'topRight',
      });
      return;
    }

    clearGallery();
    page = 1;
    hideLoadMoreButton();
    showLoader();

    try {
      const data = await getImagesByQuery(query, page);
      totalHits = data.totalHits;

      if (data.hits.length === 0) {
        iziToast.error({
          message: 'Sorry, there are no images matching your search query.',
          position: 'bottomRight',
        });
        return;
      }

      createGallery(data.hits);

      const totalPages = Math.ceil(totalHits / PER_PAGE);
      if (page < totalPages) {
        showLoadMoreButton();
      } else {
        iziToast.info({
          message: "You've reached the end of the results.",
          position: 'bottomRight',
        });
      }
    } catch (error) {
      iziToast.error({
        message: 'Something went wrong. Try again later.',
        position: 'topRight',
      });
    } finally {
      hideLoader();
      searchInput.value = '';
    }
  });

  loadMoreButton.addEventListener('click', async () => {
    page++;
    showLoader();
    hideLoadMoreButton();

    try {
      const data = await getImagesByQuery(query, page);
      createGallery(data.hits);

      const totalPages = Math.ceil(totalHits / PER_PAGE);
      if (page >= totalPages) {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'bottomRight',
        });
      } else {
        showLoadMoreButton();
      }

      scrollPage();
    } catch (error) {
      iziToast.error({
        message: 'Failed to load more images.',
        position: 'topRight',
      });
    } finally {
      hideLoader();
    }
  });

  function scrollPage() {
    const firstCard = document.querySelector('.gallery')?.firstElementChild;
    if (!firstCard) return;
    const { height: cardHeight } = firstCard.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
