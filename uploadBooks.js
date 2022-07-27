require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const mongoose = require('mongoose');
const Product = require('./models/Product');
const Utilities = require('./models/Utilities');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected...');
    populateDB();
  })
  .catch((err) => console.log(err));

async function populateDB() {
  const files = fs.readdirSync('./data/books');
  const products = [];
  const categories = [];

  for (let file of files) {
    console.log(`Reading file: ${file}. Total books: ${file.length}`);
    const fileProducts = JSON.parse(fs.readFileSync(`./data/books/${file}`, 'utf8'));
    for (let item of fileProducts) {
      // 30% change of discount
      if (Math.random() > 0.7) {
        item.discount = Math.floor(Math.random() * 30) / 100;
      } else {
        item.discount = 0;
      }

      // random stock
      item.stock = Math.floor(Math.random() * 100);

      const isNotCategoryIncluded = categories.every((category) => {
        if (category.category === item.category) {
          return false;
        }
        return true;
      });

      if (item.publishedDate) {
        const isNotIncluded = products.every((product) => {
          if (product.isbn === item.isbn || product.title === item.title) {
            return false;
          } else {
            return true;
          }
        });

        if (isNotIncluded) {
          console.log(`Adding product: ${item.title}`);
          try {
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${item.bookId}`);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const book = res.data;
            if (book.volumeInfo.imageLinks) {
              item.imageLinks = book.volumeInfo.imageLinks;
            }
          } catch (error) {
            console.log(error.message);
          }

          if (isNotCategoryIncluded) {
            const newCategory = {
              category: item.category,
              image: item.imageLinks?.large || item.imageLinks?.medium || item.imageLinks?.thumbnail,
            };

            categories.push(newCategory);
          }
          products.push(item);
        }
      }
    }
  }

  console.log('Updating Categories...');
  // Find one and update
  Utilities.findOneAndUpdate(
    { _id: '62e012294eb973c96e08ec52' },
    { $set: { categories } },
    { upsert: true },
    (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Categories updated');
      }
    }
  );

  console.log('Updating Products...');
  // Create products
  Product.insertMany(products, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${docs.length} products added to DB`);
    }
  });
}
