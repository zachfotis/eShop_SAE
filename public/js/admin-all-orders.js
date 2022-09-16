// Change Order status
const selectElements = document.querySelectorAll('select');
selectElements.forEach((select) => {
  select.addEventListener('change', (e) => {
    const id = e.target.dataset.orderid;
    const status = e.target.value;
    fetch('/admin/change-order-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, status: status }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          location.reload();
        } else {
          alert('Something went wrong');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
