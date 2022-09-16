// Change Order status
const formElements = document.querySelectorAll('form');
formElements.forEach((formElement) => {
  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = formElement.dataset.userid;

    fetch('/admin/delete-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          location.reload();
        } else {
          location.reload();
        }
      });
  });
});
