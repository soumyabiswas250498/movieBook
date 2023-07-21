const route = event => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  handleLocation();
};

const routes = {
  404: '/pages/404.html',
  '/': '/pages/index.html',
  '/add-movie': '/pages/add-movie.html',
  '/login': '/pages/login.html',
  '/signup': '/pages/signup.html',
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then(data => data.text());
  document.getElementById('render-page').innerHTML = html;
};
