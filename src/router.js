function route(event) {
  event = event || window.event;
  event.preventDefault();
  console.log(event.target.value);
}
