'use strict';
const { Client, Databases, Account, ID } = Appwrite;
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('64ba264e41167ff9cc7d');

const account = new Account(client);

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
if (clientName) {
  document.location.href = 'index.html';
}

// button select
const signupButton = document.getElementById('sunup-button');
const loginButton = document.getElementById('login-button');

//Hnadle eroor and success Messages

const errorHandler = str => {
  const errorDiv = document.getElementById('error');
  errorDiv.classList.remove('hide');
  setTimeout(() => {
    errorDiv.classList.add('hide');
  }, 10000);
  errorDiv.innerHTML = `<h3 class="text-center text-danger m-2">${str}</h3>`;
};
const messageHandler = str => {
  const errorDiv = document.getElementById('error');
  errorDiv.classList.remove('hide');
  setTimeout(() => {
    errorDiv.classList.add('hide');
  }, 10000);
  errorDiv.innerHTML = `<h3 class="text-center text-success m-2">${str}</h3>`;
};

// Handle signup

const signupHandler = (name, email, password) => {
  const promiseCreateUser = account.create(ID.unique(), email, password, name);
  promiseCreateUser.then(
    function (response) {
      messageHandler(
        `SignUp sucessful. Now you can login with email id -> ${response.email} and your password`
      );
    },
    function (error) {
      errorHandler(error);
      console.log(error);
    }
  );
};

signupButton.addEventListener('click', () => {
  const inputArrSignup = [...document.querySelectorAll('.input-signup')];
  const name = inputArrSignup[0].value;
  const email = inputArrSignup[1].value;
  const pass = inputArrSignup[2].value;
  const confPass = inputArrSignup[3].value;
  if (pass === confPass) {
    signupHandler(name, email, pass);
  } else {
    errorHandler('Password and confirm password do not match.');
  }
});

// handle login

loginButton.addEventListener('click', () => {
  const inputLogin = [...document.querySelectorAll('.input-login')];
  const email = inputLogin[0].value;
  const pass = inputLogin[1].value;
  loginHandler(email, pass);
});

function loginHandler(email, password) {
  const promiseLogIn = account.createEmailSession(email, password);

  promiseLogIn.then(
    function (response) {
      console.log(response); // Success
      document.location.href = 'index.html';
    },
    function (error) {
      console.log(error); // Failure
      errorHandler(error);
    }
  );
}
