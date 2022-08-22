const key = '29439492-1518c1b443fd85c1e4954e288';

const BASE_URL = 'https://pixabay.com/api/'

const options = {

}

export const fetchImages = (value) => {
    return fetch(`${BASE_URL}?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`).then(res => res.json())
} 