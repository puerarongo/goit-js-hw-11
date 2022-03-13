import "./css/styles.css";
import { fetchCards } from './js_function/fetchCards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

const formEl = document.querySelector(".search-form");
const inputEl = document.querySelector(".form__input");
const galleryEl = document.querySelector(".gallery");
const moreEl = document.querySelector(".load-more");
//const buttonEl = document.querySelector(".form__button");


let inputValue = null;
let saveValue = null;
let count = 0;



// ! FORM FUNCTION

const inputHandler = (event) => {
    inputValue = event.target.value;
};

const submitHandler = (event) => {
  event.preventDefault();
  count += 1;

  if (saveValue !== inputValue) {
    newQ();
  }
  
  if (count > 1) {
    return console.log(26)
  }
  
  moreEl.style.display = "inline";
  funcForPromise(inputValue, count);
  saveValue = inputValue;
};

const searchMore = () => {
  count += 1;

  funcForPromise(saveValue, count);
};


const funcForPromise = (name, counter) => {
    fetchCards(name, counter)
        .then(result => cardConstructor(result))
        .catch(error => Notify.failure("Sorry, there are no images matching your search query. Please try again."))           
};



// ! ADDITIONAL FUNCTION
const cardConstructor = (value) => {
  console.log(value);
  hitCheck(value);
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


const newQ = () => {
  count = 1;

  moreEl.style.display = "none";
  galleryEl.innerHTML = "";
}

const hitCheck = (hits) => {
  if (count === 1) {
    Notify.success(`Hooray! We found ${hits.totalHits} images.`)
  }

  if (hits.hits.length < 40) {
    moreEl.style.display = "none";
    Report.warning(
      "Warning!",
      "We're sorry, but you've reached the end of search results.",
      "Ok",
    );
  }
};




// todo Actions
inputEl.addEventListener("input", inputHandler);
formEl.addEventListener("submit", submitHandler);
moreEl.addEventListener("click", searchMore)