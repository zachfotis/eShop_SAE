const profilePage = (req, res) => {
  res.render('user/profile', {
    title: 'Profile',
    user: req.session.user,
  });
};

module.exports = {
  profilePage,
};
