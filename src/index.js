import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputRef = document.getElementById('search-box');
const listRef = document.querySelector('.country-list');
const divRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

function clearCountry() {
  listRef.innerHTML = '';
  divRef.innerHTML = '';
}

function countryList(data) {
  const ulMarkup = data
    .map(({ flags, name }) => {
      return `
     <div class = "small-country"><img src ="${flags.svg}" width = "30" height = "20" alt ="${flags.alt}"><p>${name.common}</p></div>
     `;
    })
    .join(``);
  listRef.insertAdjacentHTML(`beforeend`, ulMarkup);
}

function countryDiv(data) {
  const divMarkup = data
    .map(({ flags, capital, languages, population, name }) => {
      const language = Object.values(languages).join(`, `);
      return `
<div class = "info-section">
        <div class = "big-country">
        <img src ="${flags.svg}" width = "40" height = "30" alt ="${flags.alt}"><h2 class = "title">${name.common}</h2><p>(${name.official})</p>
        </div>
    <div class = "description-country"><p><b>Capital:</b></p><p>${capital}</p></div>
    <div class = "description-country"><p><b>Population:</b></p><p>${population}</p></div>
    <div class = "description-country"><p><b>Languages:</b></p><p>${language}</p></div>
</div>
        `;
    })
    .join(``);
  divRef.insertAdjacentHTML(`beforeend`, divMarkup);
}

inputRef.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));
function onSearchCountry(evt) {
  evt.preventDefault();
  clearCountry();
  const countryName = evt.target.value.trim();
  if (!countryName) {
    return;
  }
  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.status === 404) {
        Notiflix.Notify.failure('Oops, something went wrong');
      }
      if (data.length === 1) {
        countryDiv(data);
      }
      if (data.length <= 10 && data.length >= 2) {
        countryList(data);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure(`Oops, there is no country with that name`);
    });
}
