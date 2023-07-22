'use strict';
const { Client, Databases, Account, ID } = Appwrite;
const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('64ba264e41167ff9cc7d');

//get client data
let clientName = null;

async function getClient() {
  const account = new Account(client);
  try {
    const clientData = await account.get();
    return clientData.name;
  } catch (error) {
    // console.log(error);
    return null;
  }
}

clientName = await getClient();

//  Fetch data from the api server
async function populateMovieCard() {
  const databases = new Databases(client);

  async function getData() {
    const databases = new Databases(client);
    try {
      const response = await databases.listDocuments(
        '64ba269938b769883966',
        '64ba8f2a7b1b54e88fad'
      );

      return response;
    } catch (error) {
      modalAlertSuccessHandler(
        'Back-end server not reachable. Try again later'
      );
    }
  }

  let apiData = await getData();

  let movieData = apiData.documents;
  console.log(movieData);

  movieData.forEach(moive => {
    movieCardGenerator(moive);
    // console.log(moive);
  });
}

populateMovieCard();

function movieCardGenerator(moive) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card-section');
  cardElement.innerHTML = `
  <h2 class="card-name">${moive.title}</h2>
  <div class="card-detail d-sm-flex align-items-center">
    <div class="card-image">
      <img src="${moive.imgUrl}" height="200px" width="150px" alt="" srcset="" />
    </div>
    <div class="card-text">
      <div class="card-category">
        <p>${moive.lenguage}</p>
        <p>${moive.genre}</p>
        <p>⭐ ${moive.rating}</p>
        <p>${moive.platform}</p>
      </div>
      <div class="card-review">
        <div class="card-author">${moive.author}</div>
        <div class="card-review-content">
          <p class="lh-sm">${moive.review}</p>
        </div>
      </div>
    </div>
  </div>
    `;
  const selectElement = document.querySelector('#render-movies');
  selectElement.append(cardElement);
}

// Modal and movie card toggle
//add movie button

const selectAddMovie = document.getElementById('add-movie');
selectAddMovie.addEventListener('click', () => {
  if (clientName) {
    toggleModal();
  } else {
    document.location.href = '/login.html';
  }
});

function toggleModal() {
  let selectModal = document.getElementById('addmovies-modal');
  let renderMovies = document.getElementById('render-movies');
  renderMovies.classList.toggle('hide');
  selectModal.classList.toggle('hide');
}

// handle logout and login button user view/hide

const logoutButton = document.getElementById('logout-button');
const loginButton = document.getElementById('login-button');
const userElement = document.getElementById('user');

if (clientName) {
  loginButton.classList.add('hide');
  logoutButton.classList.remove('hide');
  userHandler(clientName);
} else {
  loginButton.classList.remove('hide');
  logoutButton.classList.add('hide');
}

function userHandler(name) {
  userElement.innerHTML = `<p class="user">Welcome ${name}</p>`;
}

// Handle logout

const logoutHandler = () => {
  const promise = account.deleteSession('current');

  promise.then(
    function (response) {
      console.log(response); // Success
      document.location.href = '/index.html';
    },
    function (error) {
      console.log(error); // Failure
    }
  );
};

logoutButton.addEventListener('click', logoutHandler);

// handel add movie modal functionality

const movieModalSubmit = document.getElementById('add-movie-submit');
movieModalSubmit.addEventListener('click', () => {
  const addMovieArray = [...document.querySelectorAll('.add-movie-input')];
  const genreSelect = document.getElementById('genre');
  const languageSelect = document.getElementById('language');
  // console.log(genreSelect.value);
  // console.log(languageSelect.value);
  // console.log(addMovieArray);
  const name = addMovieArray[0].value;
  const image = addMovieArray[1].value || '/src/movie.jpg';
  const rating = parseInt(addMovieArray[2].value);
  const platform = addMovieArray[3].value || 'N/A';
  const review = addMovieArray[4].value;
  const genre = genreSelect.value;
  const language = languageSelect.value;
  if (
    name &&
    rating <= 5 &&
    rating >= 0 &&
    review &&
    genre !== 'Genre' &&
    language !== 'Language'
  ) {
    const newMovie = {
      title: name,
      imgUrl: image,
      lenguage: language,
      genre: genre,
      rating: rating.toString(),
      platform: platform,
      author: clientName,
      review: review,
    };
    const response = createDocument(newMovie);
    console.log(response);
    populateMovieCard();
    toggleModal();
    modalAlertSuccessHandler('Your review added successfully!');
  } else {
    modalAlertErrorHandler('One or more mandetory field is invalid or empty');
  }
});

function modalAlertErrorHandler(str) {
  const modalAlert = document.getElementById('modal-alert-error');
  modalAlert.classList.remove('hide');
  modalAlert.innerHTML = `<div class="alert alert-danger">${str}</div>`;
  setTimeout(() => {
    modalAlert.classList.add('hide');
  }, 5000);
}
function modalAlertSuccessHandler(str) {
  const modalAlert = document.getElementById('modal-alert-success');
  modalAlert.classList.remove('hide');
  modalAlert.innerHTML = `<div class="alert alert-success">${str}</div>`;
  setTimeout(() => {
    modalAlert.classList.add('hide');
  }, 4000);
}

async function createDocument(object) {
  const databases = new Databases(client);
  const promise = await databases.createDocument(
    '64ba269938b769883966',
    '64ba8f2a7b1b54e88fad',
    ID.unique(),
    object
  );
  return promise;
}
