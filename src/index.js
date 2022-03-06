import "./css/styles.css";
import { fetchCards } from './js_function/fetchCards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.querySelector(".search-form");
const inputEl = document.querySelector(".form__input");
const galleryEl = document.querySelector(".gallery");
//const buttonEl = document.querySelector(".form__button");


let inputValue = null;

const inputHandler = (event) => {
    inputValue = event.target.value;
};

const submitHandler = (event) => {
    event.preventDefault();
    
    funcForPromise(inputValue);
};


const funcForPromise = (name) => {
    fetchCards(name)
        .then(result => cardConstructor(result))
        .catch(error => Notify.failure("Sorry, there are no images matching your search query. Please try again."))           
};


const cardConstructor = (value) => {
    console.log(value.hits);
    let makeCard = value.hits.map((elem) => `<div class="photo-card">
  <img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes - ${elem.likes}</b>
    </p>
    <p class="info-item">
      <b>Views - ${elem.views}</b>
    </p>
    <p class="info-item">
      <b>Comments - ${elem.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads - ${elem.downloads}</b>
    </p>
  </div>
</div>`).join("");
    
    galleryEl.insertAdjacentHTML("beforeend", makeCard);
};


inputEl.addEventListener("input", inputHandler);
formEl.addEventListener("submit", submitHandler);