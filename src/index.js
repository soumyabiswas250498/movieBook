'use strict';
const { Client, Databases, Account, ID } = Appwrite;
const client = new Client();
const account = new Account(client);
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('64ba264e41167ff9cc7d');

//get client data
let clientName = null;

async function getClient() {
  try {
    const clientData = await account.get();
    return clientData.name;
  } catch (error) {
    // console.log(error);
    return null;
  }
}

clientName = await getClient();
console.log('hello ' + clientName);

//  Fetch data from the api server

const databases = new Databases(client);
async function getData() {
  const databases = new Databases(client);
  const response = await databases.listDocuments(
    '64ba269938b769883966',
    '64ba8f2a7b1b54e88fad'
  );

  return response;
}
let apiData = await getData();

let movieData = apiData.documents;
// console.log(movieData);

movieData.forEach(moive => {
  movieCardGenerator(moive);
  // console.log(moive);
});

function movieCardGenerator(moive) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card-section');
  cardElement.innerHTML = `
    <h2 class="card-name">${moive.title}</h2>
    <div class="card-detail d-sm-flex align-items-center">
      <img
        src="${moive.imgUrl}"
        height="200px"
        width="150px"
        alt=""
        srcset=""
      />
      <div class="card-text">
        <div class="card-category">
          <p>${moive.lenguage}</p>
          <p>${moive.genre}</p>
          <p>⭐ ${moive.rating}</p>
          <p> ${moive.platform}</p>
        </div>

        <div class="card-review">
          <div class="card-author">${moive.author}</div>
          <div class="card-review-content">
            <p class="lh-sm">
            ${moive.review}
            </p>
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
selectAddMovie.addEventListener('click', toggleModal);

function toggleModal() {
  let selectModal = document.getElementById('addmovies-modal');
  let renderMovies = document.getElementById('render-movies');
  renderMovies.classList.toggle('hide');
  selectModal.classList.toggle('hide');
}

//cancel button

// handle logout and login button view/hide

const logoutButton = document.getElementById('logout-button');
const loginButton = document.getElementById('login-button');

if (clientName) {
  loginButton.classList.add('hide');
  logoutButton.classList.remove('hide');
} else {
  loginButton.classList.remove('hide');
  logoutButton.classList.add('hide');
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
