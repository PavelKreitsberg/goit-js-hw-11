import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createCardsMarkup from './template/card-photo.hbs';
import axios from "axios";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const getImages = (query, page) => {
    const key = '29439492-1518c1b443fd85c1e4954e288';

    const BASE_URL = 'https://pixabay.com/api/'

    return axios.get(`${BASE_URL}?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`).then(res => res.data)
}

const refs = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

let page = 1;
let searchQuery = '';

const hideLoadMoreBtn = () => {
    refs.loadMoreBtn.classList.add('visually-hidden');
}

const showLoadMoreBtn = () => {
    refs.loadMoreBtn.classList.remove('visually-hidden');
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

const renderImagesList = (evt) => {
    evt.preventDefault();
    hideLoadMoreBtn();
    
    page = 1;

    refs.gallery.innerHTML = '';

    searchQuery = evt.target.searchQuery.value;

    if (!searchQuery) {
        showNotification('empty');
        return;
    }
    

    getImages(searchQuery, page).then(res => {        

        if (!res.hits[0]) {            
            showNotification('failure');
            return;
        }

        refs.gallery.insertAdjacentHTML('beforeend', createCardsMarkup(res.hits));
        showNotification('success', res.totalHits);
        const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250 })

        if (res.hits.length <= 40) {
            return;
        }        
        
        showLoadMoreBtn()       
    })
}

const addMoreImages = () => {
    page += 1;

    getImages(searchQuery, page).then(res => {        
        
        refs.gallery.insertAdjacentHTML('beforeend', createCardsMarkup(res.hits));

        const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionPosition: 'bottom', captionDelay: 250 })

        if (res.totalHits === refs.gallery.childElementCount) {
            hideLoadMoreBtn();
            showNotification('end')
            return;
        }

        showLoadMoreBtn();
        showNotification('success', res.totalHits);
})
}


refs.form.addEventListener('submit', renderImagesList)

refs.loadMoreBtn.addEventListener('click', addMoreImages)