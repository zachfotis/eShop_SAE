const form = document.querySelector('form');
const addButton = document.getElementById('add-admin');
const editButton = document.getElementById('edit-admin');
const deleteButton = document.getElementById('delete-admin');

const addProduct = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const dataObject = Object.fromEntries(data);
  const response = await fetch('/admin/add-product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataObject),
  });
  const result = await response.json();
  if (result.status === 'success') {
    window.location.href = '/admin/all-products';
  } else {
    alert(result.message);
  }
};

const editProduct = async (e) => {
  console.log('edit');
  e.preventDefault();
  const data = new FormData(form);
  const dataObject = Object.fromEntries(data);
  const response = await fetch('/admin/edit-product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataObject),
  });
  const result = await response.json();
  if (result.status === 'success') {
    window.location.href = '/admin/all-products';
  } else {
    alert(result.message);
  }
};

const deleteProduct = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const dataObject = Object.fromEntries(data);
  const response = await fetch('/admin/delete-product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataObject),
  });
  const result = await response.json();
  if (result.status === 'success') {
    window.location.href = '/admin/all-products';
  } else {
    alert(result.message);
  }
};

try {
  addButton.addEventListener('click', addProduct);
} catch (error) {
  console.log(error);
}

try {
  editButton.addEventListener('click', editProduct);
  deleteButton.addEventListener('click', deleteProduct);
} catch (error) {
  console.log(error);
}
