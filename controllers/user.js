const axios = require('axios');
const countryList = require('../data/countries.js');
const User = require('../models/User');

const profilePage = (req, res) => {
  let shippingData = null;
  if (req.session.user?.shipping) {
    shippingData = req.session.user.shipping;
  }
  res.render('user/profile', {
    title: 'Profile',
    countryList,
    shippingData: shippingData,
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

module.exports = {
  profilePage,
  updateShipping,
};
