const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keyup', (e) => {
  const searchValue = e.target.value.trim();
  const searchResults = document.querySelector('.result-list');

  if (searchValue.length === 0) {
    searchResults.classList.remove('active');
    searchResults.innerHTML = '';
  }

  if (searchValue.trim().length > 3) {
    fetch(`/search?terms=${searchValue}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          if (data.products.length > 0) {
            searchResults.innerHTML = '';
            searchResults.classList.add('active');
            data.products.forEach((book) => {
              const resultBook = document.createElement('a');
              resultBook.classList.add('result-book');
              resultBook.classList.add('rounded-md');
              resultBook.href = `/products/${book._id}`;
              resultBook.innerHTML = `
              <img
              src="http://books.google.com/books/publisher/content?id=${book.bookId}&printsec=frontcover&img=1&zoom=1"
              class="result-book-img"
              />
              <div class="result-book-info">
                <h3 class="result-book-title">${book.title}</h3>
                <p class="result-book-author">by ${book.authors.join(', ')}</p>
              </div>
              `;
              searchResults.appendChild(resultBook);
            });
          } else {
            searchResults.innerHTML = '';
            const resultBook = document.createElement('a');
            resultBook.classList.add('result-book');
            resultBook.classList.add('rounded-md');
            resultBook.innerHTML = `
              <div class="result-book-info">
                <h3 class="result-book-title">No Results Found</h3>
              </div>
              `;
            searchResults.appendChild(resultBook);
          }
        }
      });
  }
});

window.addEventListener('click', (e) => {
  const searchResults = document.querySelector('.result-list');
  if (e.target !== searchInput) {
    searchResults.classList.remove('active');
    searchResults.innerHTML = '';
  }
});
