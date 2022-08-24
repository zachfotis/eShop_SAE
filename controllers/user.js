const axios = require('axios');
const countryList = require('../data/countries.js');
const User = require('../models/User');

const profilePage = (req, res) => {
  res.render('user/profile', {
    title: 'Profile',
    countryList,
    user: req.session.user,
  });
};

const updateShipping = (req, res) => {
  let shippingData = {};

  if (
    req.body?.recipient &&
    req.body.recipient.length > 0 &&
    req.body?.streetName &&
    req.body.streetName.length > 0 &&
    req.body?.streetNumber &&
    req.body.streetNumber.length > 0 &&
    req.body?.city &&
    req.body.city.length > 0 &&
    req.body?.country &&
    req.body.country.length > 0 &&
    req.body?.postalCode &&
    req.body.postalCode.length > 0
  ) {
    shippingData = {
      recipient: req.body.recipient,
      streetName: req.body.streetName,
      streetNumber: req.body.streetNumber,
      city: req.body.city,
      country: req.body.country,
      postalCode: req.body.postalCode,
    };
  }

  if (Object.keys(shippingData).length > 0) {
    const shippingDataEncoded = encodeURIComponent(JSON.stringify(shippingData));
    const url = `${process.env.GEO_API}address=${shippingDataEncoded}&key=${process.env.GEO_KEY}`;
    axios
      .get(url)
      .then((response) => {
        shippingData.geoLocation = {
          lat: response.data.results[0].geometry.location.lat,
          lng: response.data.results[0].geometry.location.lng,
        };
        // Update Mongo
        return User.findByIdAndUpdate(req.session.user._id, { $set: { shipping: shippingData } }, { new: true });
      })
      .then((user) => {
        req.session.user = user;
        return res.redirect(
          '/user/profile' + `?message=${encodeURIComponent('Shipping details have successfully updated!')}&type=success`
        );
      })
      .catch((error) => {
        return res.redirect('/user/profile' + `?message=${encodeURIComponent('Something went wrong!')}&type=error`);
      });
  } else {
    return res.redirect(
      '/user/profile' + `?message=${encodeURIComponent('Shipping details are not correct or missing')}&type=error`
    );
  }
};

const updateCard = (req, res) => {
  let cardData = {};

  if (req.body.cardExpirationDate) {
    const cardExpirationDate = req.body.cardExpirationDate.replace(/\//g, '');
    const cardYearDigits = cardExpirationDate.substring(cardExpirationDate.length - 2);
    const cardMonthDigits = cardExpirationDate.substring(0, cardExpirationDate.length - 2);

    // get two last digits from current year
    const currentYear = new Date().getFullYear();
    const currentYearDigits = Number(currentYear.toString().substring(currentYear.toString().length - 2));
    // get current month in two digits
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthDigits = Number(currentMonth < 10 ? '0' + currentMonth : currentMonth);

    // Invalid Month
    if (cardMonthDigits < 1 || cardMonthDigits > 12) {
      return res.redirect(
        '/user/profile' + `?message=${encodeURIComponent('Card expiration date is not correct')}&type=error`
      );
    }

    // Invalid Year
    if (cardYearDigits > currentYearDigits + 10) {
      return res.redirect(
        '/user/profile' + `?message=${encodeURIComponent('Card expiration date is not correct')}&type=error`
      );
    }

    // Card Expired
    if (
      cardYearDigits <= currentYearDigits &&
      (cardMonthDigits < currentMonthDigits || cardMonthDigits > currentMonthDigits)
    ) {
      return res.redirect('/user/profile' + `?message=${encodeURIComponent('Card is expired')}&type=error`);
    }
  }

  if (
    req.body?.cardOwner &&
    req.body.cardOwner.length > 0 &&
    req.body?.cardNumber &&
    req.body.cardNumber.length === 19 &&
    req.body.cardNumber.match(/^-{0,1}[0-9]{4}-{0,1}[0-9]{4}-{0,1}[0-9]{4}-{0,1}[0-9]{4}$/) &&
    req.body?.cardExpirationDate &&
    req.body.cardExpirationDate.length === 5 &&
    req.body.cardExpirationDate.includes('/')
  ) {
    cardData = {
      cardOwner: req.body.cardOwner,
      cardNumber: req.body.cardNumber,
      cardExpirationDate: req.body.cardExpirationDate,
      cardType: getCardType(req.body.cardNumber),
    };
  }

  if (Object.keys(cardData).length > 0) {
    User.findByIdAndUpdate(req.session.user._id, { $push: { creditCards: cardData } }, { new: true })
      .then((user) => {
        req.session.user = user;
        return res.redirect(
          '/user/profile' + `?message=${encodeURIComponent('Credit card has successfully added!')}&type=success`
        );
      })
      .catch((error) => {
        return res.redirect('/user/profile' + `?message=${encodeURIComponent('Something went wrong!')}&type=error`);
      });
  } else {
    return res.redirect(
      '/user/profile' + `?message=${encodeURIComponent('Card details are not correct or missing')}&type=error`
    );
  }
};

function getCardType(number) {
  // Visa
  let re = new RegExp('^4');
  if (number.match(re) != null) return 'Visa';

  // Mastercard
  re = new RegExp('^5');
  if (number.match(re) != null) return 'Mastercard';

  return 'Unknown';
}

module.exports = {
  profilePage,
  updateShipping,
  updateCard,
};
