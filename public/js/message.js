let messageContainer = document.querySelector('.message-container');

if (messageContainer) {
  // get current url
  const url = window.location.href;
  // remove query string from url
  const urlWithoutQueryString = url.split('?')[0];
  // change url without query string
  window.history.pushState({}, null, urlWithoutQueryString);
  setTimeout(() => {
    messageContainer.remove();
  }, 3000);
}
