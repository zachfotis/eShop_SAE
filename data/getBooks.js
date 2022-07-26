const axios = require('axios');

let totalBooks = 0;
let pages = 10;
let currentPage = 0;
let filteredBooks = [];

const fetchBook = async (query, currentPage) => {
  try {
    const data = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${currentPage}&maxResults=40`
    );
    totalBooks = data.data.totalItems;
    pages = Math.ceil(totalBooks / 40);
    const books = data.data.items;
    books.forEach((book) => {
      if (
        book.volumeInfo?.description &&
        book.volumeInfo?.printType === 'BOOK' &&
        book.saleInfo?.retailPrice?.amount & book.volumeInfo.industryIdentifiers?.[1]?.identifier &&
        book.volumeInfo.pageCount &&
        book.volumeInfo.categories?.[0]
      ) {
        filteredBooks.push({
          title: book.volumeInfo.title,
          category: book.volumeInfo.categories[0],
          description: book.volumeInfo.description,
          shortDescription: book.searchInfo?.textSnippet,
          authors: book.volumeInfo.authors,
          publisher: book.volumeInfo.publisher,
          publishedDate: book.volumeInfo.publishedDate,
          isbn: book.volumeInfo.industryIdentifiers?.[1]?.identifier,
          pageCount: book.volumeInfo.pageCount,
          imageLinks: book.volumeInfo.imageLinks,
          saleInfo: book.saleInfo?.retailPrice?.amount,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const main = async () => {
  const query = 'psychology';

  while (currentPage < pages) {
    console.log('Fetching page: ', currentPage, 'of', pages);
    await fetchBook(query, currentPage);
    currentPage++;
    console.log('');
  }

  // create new object with categories
  const categories = {};
  filteredBooks.forEach((book) => {
    if (book.category) {
      if (!categories[book.category]) {
        categories[book.category] = [];
      }
      categories[book.category].push(book);
    }
  });

  console.log('Creating File');
  const fs = require('fs');

  Object.keys(categories).forEach((category) => {
    const file = `./books/${category}.json`;
    fs.appendFile(file, JSON.stringify(categories[category]), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

main();
