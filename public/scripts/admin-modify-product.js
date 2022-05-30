// get form
const form = document.querySelector('form.form-admin');
// get add, edit and delete buttons
const addButton = document.querySelector('#add-admin');
const editButton = document.querySelector('#edit-admin');
const deleteButton = document.querySelector('#delete-admin');

if (addButton) {
  addButton.addEventListener('click', (e) => {
    e.preventDefault();
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/admin/add-product');
    form.submit();
  });
}

if (editButton) {
  editButton.addEventListener('click', (e) => {
    e.preventDefault();
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/admin/edit-product');
    form.submit();
  });
}

if (deleteButton) {
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/admin/delete-product');
    form.submit();
  });
}

const formData = {};
for (let i = 0; i < form.elements.length; i++) {
  const element = form.elements[i];
  if (element.name) {
    formData[element.name] = element.value;
  }
}
