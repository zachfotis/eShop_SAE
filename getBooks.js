const axios = require('axios');
require('dotenv').config();

let pages = 10;
let currentPage = 0;
let filteredBooks = [];

const fetchBook = async (query, currentPage) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const data = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&startIndex=${currentPage}&maxResults=40&printType=books`
    );
    const totalBooks = data.data.totalItems;
    pages = Math.ceil(totalBooks / 40);
    const books = data.data.items;
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      if (
        book.volumeInfo?.description &&
        book.volumeInfo?.printType === 'BOOK' &&
        book.saleInfo?.retailPrice?.amount & book.volumeInfo.industryIdentifiers?.[1]?.identifier &&
        book.volumeInfo.pageCount &&
        book.volumeInfo.categories?.[0]
      ) {
        const bookData = {
          bookId: book.id,
          title: book.volumeInfo.title,
          category: book.volumeInfo.categories[0],
          description: book.volumeInfo.description,
          shortDescription: book.searchInfo?.textSnippet,
          authors: book.volumeInfo.authors,
          publisher: book.volumeInfo.publisher,
          publishedDate: book.volumeInfo.publishedDate,
          isbn: book.volumeInfo.industryIdentifiers?.[1]?.identifier,
          pageCount: book.volumeInfo.pageCount,
          price: book.saleInfo?.retailPrice?.amount,
        };
        // try {
        //   const moreData = await axios.get(
        //     `https://www.googleapis.com/books/v1/volumes/${book.id}?key=${process.env.BOOKS_KEY}`
        //   );
        //   await new Promise((resolve) => setTimeout(resolve, 1500));
        //   bookData.imageLinks = moreData.data.volumeInfo.imageLinks;
        // } catch (error) {
        //   console.log(error.message);
        // }
        bookData.imageLinks = book.volumeInfo.imageLinks;

        const isNotIncluded = filteredBooks.every(
          (book) => book.isbn !== bookData.isbn && book.title !== bookData.title
        );

        if (isNotIncluded) {
          filteredBooks.push(bookData);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const main = async () => {
  const queries = [
    'Artificial Intelligence',
    'Computer Science',
    'Data Science',
    'Database',
    'Data Analytics',
    'Data Visualization',
    'Machine Learning',
    'Natural Language Processing',
    'Programming',
    'Web Development',
    'Web Design',
    'Algebra',
    'Calculus',
    'Statistics',
    'Physics',
    'English',
    'History',
    'Geography',
    'Science',
    'Social Studies',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'Foreign Language',
    'Music',
    'Art',
    'Physical Education',
    'Health',
    'Business',
    'Economics',
    'Accounting',
    'Business Law',
    'Business Math',
    'javascript',
    'python',
    'java',
    'c++',
    'c#',
    'c',
    'ruby',
    'php',
    'html',
    'css',
    'sql',
    'nodejs',
    'react',
    'angular',
    'vue',
    'reactjs',
    'angularjs',
  ];

  for (let i = 0; i < queries.length; i++) {
    console.log(`Fetching books for ${queries[i]}`);

    while (currentPage <= pages) {
      console.log('Fetching page: ', currentPage, 'of', pages);
      await fetchBook(queries[i], currentPage);
      currentPage++;
    }

    currentPage = 0;
    pages = 10;
  }

  // Create Categories
  const categories = {};
  filteredBooks.forEach((book) => {
    if (book.category) {
      if (!categories[book.category]) {
        categories[book.category] = [];
      }
      categories[book.category].push(book);
    }
  });

  // Create Files
  console.log('Creating files...');
  const fs = require('fs');
  Object.keys(categories).forEach((category) => {
    const file = `./data/books/${category}.json`;
    fs.appendFile(file, JSON.stringify(categories[category]), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

main();
