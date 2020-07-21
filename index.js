const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src='${imgSrc}'/>
      ${movie.Title}
      (${movie.Year})
    `; //to write a multiline string in javascript we use backticks
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "94398046",
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector(".left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    fetchMovieDetails(movie, document.querySelector("#left-summary"), "left");
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector(".right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    fetchMovieDetails(movie, document.querySelector("#right-summary"), "right");
  },
});

let leftMovie;
let rightMovie;

const fetchMovieDetails = async ({ imdbID }, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "94398046",
      i: imdbID,
    },
  });
  //return response.data;
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runComparision();
  }
};

const runComparision = () => {
  //get all the elments on left side
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );

  //get all the elments on right side
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftstats, index) => {
    const rightstats = rightSideStats[index];

    const leftSideValue = parseInt(leftstats.dataset.value);
    const rightSideValue = parseInt(rightstats.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftstats.classList.remove("is-primary");
      leftstats.classList.add("is-warning");
    } else {
      rightstats.classList.remove("is-primary");
      rightstats.classList.add("is-warning");
    }
  });
};

const movieTemplate = (movieDetail) => {
  const awards = movieDetail.Awards.split(" ").reduce((prev, current) => {
    const value = parseInt(current);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const boxOffice = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );

  return `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  <article class='media'>
    <figure class='media-left'>
      <p class='image'>
        <img src='${movieDetail.Poster}'/>
      </p>
    </figure>
    <div class='media-content'>
      <div class='content'>
      <h1>${movieDetail.Title}</h1>
      <h1>${movieDetail.Genre}</h1>
      <p>${movieDetail.Plot}</p>
      </div>
    </div>  
  </article> 
  <article data-value=${awards} class='notification is-primary'>
    <p class='title'>${movieDetail.Awards}</p>
    <p class='subtitle'>Awards</p>
  </article>   
  <article data-value=${boxOffice} class='notification is-primary'>
    <p class='title'>${movieDetail.BoxOffice}</p>
    <p class='subtitle'>Box Office</p>
  </article> 
  <article data-value=${metaScore} class='notification is-primary'>
    <p class='title'>${movieDetail.Metascore}</p>
    <p class='subtitle'>Metascore</p>
  </article> 
  <article data-value=${imdbRating} class='notification is-primary'>
    <p class='title'>${movieDetail.imdbRating}</p>
    <p class='subtitle'>IMDB Rating</p>
  </article> 
  <article data-value=${imdbVotes} class='notification is-primary'>
    <p class='title'>${movieDetail.imdbVotes}</p>
    <p class='subtitle'>IMDB Votes</p>
  </article>      
  `;
};
