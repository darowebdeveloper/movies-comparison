const createAutoComplete = ({
  root, renderOption, onOptionSelect, inputValue, fetchData
}) => {
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" type="text" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
      </div>
    </div>
  `;
  const input = root.querySelector('.input'); 
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');


  const onInput = async (event) => {
    // fetchData return a promise
    const items = await fetchData(event.target.value);
    // if no items
    if(!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }
    // clear previous results
    resultsWrapper.innerHTML = '';
    
    dropdown.classList.add('is-active');

    for (let item of items) {
      const option = document.createElement('a');
      
      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);
      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onOptionSelect(item);
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
};