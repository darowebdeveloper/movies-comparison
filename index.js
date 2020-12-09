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

const input = document.querySelector('input');

const onInput = async (event) => {
  const movies = await fetchData(event.target.value);
  for (let movie of movies) {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${movie.Poster}" />
      <h1>${movie.Title}</h1>
    `;
    document.querySelector('#target').appendChild(div);
  }
};
// input event when user changes text in the input
input.addEventListener('input', debounce(onInput, 500));