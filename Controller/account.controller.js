const User = require("..Models/user.model");

module.exports = {
  getAllUser: (req, res) => {
    User.find({}, (err, account) => {
      if (err) return next(err);
      res.render("account/list-account", {
        account,
      });
    });
  },
};
