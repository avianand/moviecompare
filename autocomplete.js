const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
      <label><b> Search </b></label><br/>
      <input class="input"/>
      <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
      </div>
      </div
      `;

  const input = root.querySelector("input");

  const dropdown = root.querySelector(".dropdown");
  const resultWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    //console.log(items);
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    resultWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let item of items) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      option.addEventListener("click", () => {
        input.value = inputValue(item);
        dropdown.classList.remove("is-active");
        const div = document.createElement("div");
        onOptionSelect(item);
      });
      resultWrapper.append(option);
    }
  };

  const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
      //wrapper which guides how often func is invoked

      if (timeoutId) {
        clearInterval(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  input.addEventListener("input", debounce(onInput, 500));

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });

  // onOptionSelect(){}
  // root element that autocomplete should be rendered into.
};
