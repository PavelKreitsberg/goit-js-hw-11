import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import createCardsMarkup from './template/card-photo.hbs';
import { fetchImages } from './js/fetchApi';

const refs = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    gallery: document.querySelector('.gallery'),
    loadmoreBtn: document.querySelector('.load-more')
}


const showNotification = (status, amount) => {
    if (status === 'failure') {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
    if (status === 'end') {
        Notify.info('We`re sorry, but you`ve reached the end of search results.')
    }
    if (status === 'empty') {
        Notify.info('Fill the form for searching')
    }

    if (status === 'success') {
        Notify.success(`Hooray! We found ${amount} images.`)
    }
}

const createRequest = (evt) => {
    evt.preventDefault();    

    const searchQuery = evt.target.searchQuery.value

    if (!searchQuery) {
        showNotification('empty');
        return;
    }

    refs.gallery.innerHTML = '';

    fetchImages(searchQuery).then(res => {
        console.log(res);
        if (!res.hits[0]) {
            showNotification('failure');
            return;
        }

        refs.loadmoreBtn.classList.remove('visually-hidden')
        refs.gallery.innerHTML = createCardsMarkup(res.hits);
        showNotification('success', res.totalHits);
})

}




refs.form.addEventListener('submit', createRequest)


// const params = [{
//     webformatURL: "https://pixabay.com/get/g196ce78e8dd3b8ed8d478a4ef28e2c1f8835d5dc9a293c46663ed3bf70a80d091eec61c53e7c3b6f09e88db92033e25a_640.jpg",
//     largeImageURL: "https://pixabay.com/get/g4eb48e54ff2e871f4bd76be0e63d1167b8da05cba234d633455daa89ff105ff90c82f169073b055d9e8dcbb474f2d1fc192cd67dd5269309759818174a663268_1280.jpg",
//     tags: "tree, cat, silhouette",
//     likes: 2559,
//     views: 998633,
//     comments: 486,
//     downloads: 484481,
// }]










// const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250 })
