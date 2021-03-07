const fetchData = async (searchTerm) => {
  const response = await axios.get(`http://www.omdbapi.com/`, {
    params: {
      apikey: 'c9a8f1f',
      s: searchTerm,
    },
  });
  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

const root = document.querySelector('#autocomplete');
root.innerHTML = `
  <label><b>Search for a movie </b></label>
  <input class="input" type="text" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
      </div>
    </div>
  </div>
`;
const input = document.querySelector('.input'); 
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


const onInput = async (event) => {
  // fetchData return a promise
  const movies = await fetchData(event.target.value);
  // if no movies
  if(!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }
  // clear previous results
  resultsWrapper.innerHTML = '';
  
  dropdown.classList.add('is-active');

  for (let movie of movies) {
    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    option.classList.add('dropdown-item');
    option.innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
      input.value = movie.Title;
      onMovieSelect(movie);
    });
    resultsWrapper.appendChild(option);
  }
};
// input event when user changes text in the input
input.addEventListener('input', debounce(onInput, 500));

// To hide the dropdown when click outside 
document.addEventListener('click', (event) => {
  if(!root.contains(event.target)) {
    dropdown.classList.remove('is-active');
  }
  
});

const onMovieSelect = async (movie) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'c9a8f1f',
      i: movie.imdbID,
    }
  });
  document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class"title">${movieDetail.Awards}</p>
      <p class="subtitle">Award</p>
    </article>
    <article class="notification is-primary">
      <p class"title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class"title">${movieDetail.Metascore}</p>
      <p class="subtitle">Meta Score</p>
    </article>
    <article class="notification is-primary">
      <p class"title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class"title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};