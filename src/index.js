import "./css/styles.css";
import fetchCards from './api/fetchCards';

import { throttle } from 'throttle-debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const formEl = document.querySelector(".search-form");
const inputEl = document.querySelector(".form__input");
const galleryEl = document.querySelector(".gallery");

let inputValue = null;
let saveValue = null;
let count = 0;
let total = 0;


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
    return
  }
  
  funcForPromise(inputValue, count);
  saveValue = inputValue;
};


const funcForPromise = async (name, counter) => {
  try {
    const galleryCard = await fetchCards(name, counter);

    if (galleryCard.data.total !== 0) {
      const result = cardConstructor(galleryCard.data);
      total = galleryCard.data.total;
      return result
    }
    throw new Error(console.log("ERROR!"));
  }
  catch (error) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again."); 
  }          
};


// ! ADDITIONAL FUNCTION
const cardConstructor = (value) => {
  hitCheck(value);
  let makeCard = value.hits.map((elem) => `<div class="photo-card">
  <a class="gallery__link" href="${elem.webformatURL}"><img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" /></a>
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
  
  lightbox.refresh();

  // todo Sccroll
  //const cardHeight = document.firstElementChild.getBoundingClientRect().height;
  //scroll(cardHeight);
};


const newQ = () => {
  count = 1;
  galleryEl.innerHTML = "";
};


const hitCheck = (hits) => {
  if (count === 1) {
    Notify.success(`Hooray! We found ${hits.totalHits} images.`)
  }

  if (hits.hits.length < 40) {
    Report.warning(
      "Warning!",
      "We're sorry, but you've reached the end of search results.",
      "Ok",
    );
  }
};

//const scroll = (height) => {
//  window.scrollBy({ top: height, behavior: "smooth" });
//}


const infiniteScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5 && (total === 0 || count * 40 < total)) {
    console.log("in if")

    count += 1;
    funcForPromise(saveValue, count);
  }
};

// todo Interface
  const lightbox = new SimpleLightbox(".gallery__link", {
      captionsData: "alt",
      captionDelay: 200,
      captionPosition: "bottom",
  });


// todo Actions
inputEl.addEventListener("input", inputHandler);
formEl.addEventListener("submit", submitHandler);
window.addEventListener("scroll", throttle(300, infiniteScroll))
