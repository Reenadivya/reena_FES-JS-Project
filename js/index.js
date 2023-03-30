"use strict";

const API_KEY = "b10ae972650314d659a0fc1e4ad88d48";

const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const POSTER_PATH = "https://image.tmdb.org/t/p/w500";

const form = document.querySelector(".form");
const searchButton = document.querySelector(".search-button");
const searchInput = document.getElementById("search");
const main = document.getElementById("main");
const filterSelect = document.getElementById("filter");
const featuredMovies = document.querySelector(".featured__movies-container");
const movieCategories = document.querySelector(".category__list");
const movieCategoriesHeader = document.querySelector(".categories-header");
const movieList = document.querySelector(".movie__list");
const hamburger = document.querySelector(".hamburger");
const blackScreen = document.querySelector(".black-screen");
const mobileNav = document.querySelector(".mobile-nav");
const closeBtn = document.querySelector(".close");

async function movieData(url) {
  try {
    featuredMovies.classList += " featured__movies--loading";

    setTimeout(async () => {
      const response = await fetch(url);
      const { results } = await response.json();

      const featuredMovArr = results.slice(0, 6);
      const markup = featuredMovArr
        .map((movie) => {
          const title = movie.title ? movie.title : movie.name;
          const releaseDate = movie.release_date
            ? movie.release_date
            : movie.first_air_date;
          const rating = movie.vote_average.toFixed(1);
          const imgPath =
            POSTER_PATH + movie.poster_path
              ? POSTER_PATH + movie.poster_path
              : `<p>Sorry we couldn't find a poster for this image!</p>`;

          return `
          <div class="movie__item">
            <img class="movie__item-img" src="${
              POSTER_PATH + imgPath
            }" alt="" />
            <div class="movie__item-description">
              <h3 class="movie-title">${title}</h3>
              <p>Release Date: ${releaseDate}</p>
              <p>Rating: ${rating}/10</p>
            </div>
          </div>
        `;
        })
        .join("");

      movieList.innerHTML = markup;
      featuredMovies.classList.remove("featured__movies--loading");
    }, 300);
  } catch (err) {
    console.log(err);
  }
}

async function renderMovieCategories() {
  const categoryID = [28, 35, 18];

  try {
    movieCategories.classList += " featured__movies--loading";
    setTimeout(async () => {
      for (let i = 0; i < categoryID.length; i++) {
        const category = categoryID[i];

        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${category}`;

        const response = await fetch(url);
        const { results } = await response.json();

        const movies = results.slice(2, 6);

        // Get the category element from the DOM
        const categoryEl = document.getElementById(category);

        // Get the category posters element from the DOM
        const postersEl = categoryEl.querySelector(".category__item-posters");
        const moviePosters = movies.map((movie) => {
          const posterUrl = `${POSTER_PATH}${movie.poster_path}`;
          return `
        <div class="posters__container">
        <img src="${posterUrl}" alt="${
            movie.title
          }" class="categories__poster" />
        <h3 class="categories__poster-title">${
          !movie.title ? movie.name : movie.title
        }</h3>
        </div>
        `;
        });
        postersEl.innerHTML = moviePosters.join("");
        movieCategories.classList.remove("featured__movies--loading");
      }
    }, 300);
  } catch (err) {
    console.log(err);
  }
}

async function searchMovies(url) {
  try {
    main.classList += " featured__movies--loading";
    featuredMovies.classList.add("hidden"); // add this line to hide the featured movies section
    movieCategories.classList.add("hidden"); // add this line to hide the featured movies section
    movieCategoriesHeader.classList.add("hidden"); // add this line to hide the featured movies section
    setTimeout(async () => {
      const response = await fetch(url);
      const { results } = await response.json();

      showSearchMovies(results);
      main.classList.remove("featured__movies--loading");
      featuredMovies.classList.remove("hidden"); // add this line to show the featured movies section again
      movieCategories.classList.remove("hidden"); // add this line to show the featured movies section again
      movieCategoriesHeader.classList.remove("hidden"); // add this line to show the featured movies section again
    }, 300);
  } catch (error) {
    console.error("Error searching for movies:", error);
  }
}

function showSearchMovies(movies) {
  main.innerHTML = "";
  main.classList.add("main");

  const moviesHTML = movies
    .map((movie) => {
      const { title, poster_path, vote_average, overview } = movie;
      const rateClass = getClassByRate(vote_average);

      return `
        <div class="movie">
          <img src="${POSTER_PATH + poster_path}" alt="${title} poster">
          <div class="movie-info">
            <h3>${title}</h3>
            <span class="${rateClass}">${vote_average.toFixed(1)}</span>
          </div>
          <div class="overview">
            <h3>Overview</h3>
            ${overview}
          </div>
        </div>
      `;
    })
    .join("");

  main.innerHTML = moviesHTML;
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function sortMovies() {
  const movies = Array.from(main.querySelectorAll(".movie"));
  console.log(movies);
  const filterValue = filterSelect.value;
  console.log(filterValue);
  const sortedMovies = movies.sort((a, b) => {
    const aRating = parseFloat(a.querySelector(".movie-info span").textContent);
    const bRating = parseFloat(b.querySelector(".movie-info span").textContent);
    return filterValue === "low-to-high"
      ? aRating - bRating
      : bRating - aRating;
  });
  main.innerHTML = "";
  main.append(...sortedMovies);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  console.log(searchTerm);
  if (searchTerm) {
    searchMovies(SEARCH_URL + searchTerm);
    searchInput.value = "";
  }
});

searchButton.addEventListener("click", () => {
  main.scrollIntoView({ behavior: "smooth" });
});

hamburger.addEventListener("click", () => {
  document.body.classList.toggle("noscroll");
  hamburger.classList.toggle("open");
  blackScreen.classList.toggle("show");
  mobileNav.classList.toggle("show");
});

closeBtn.addEventListener("click", () => {
  document.body.classList.remove("noscroll");
  hamburger.classList.remove("open");
  blackScreen.classList.remove("show");
  mobileNav.classList.remove("show");
});

window.onload = () => {
  setTimeout(() => {
    movieData(TRENDING_MOVIES_URL);
    renderMovieCategories();
  });
};
