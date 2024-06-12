const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

//USER AUTHENTICATION
module.exports = async (req, res, next) => {
  try {
    const getToken = req.header("Authorization");

    if (!getToken) return res.status(401).send("Unauthorised");

    const token = getToken;

    const decoded = jwt.verify(token, "fpmssecret");

    const user = await User.findOne({
      _id: decoded.user_id,
      token: String(getToken),
    });

    if (!user) {
      // throw new Error(Con.USER_NOT_FOUND_MSG);
      return res.status(401).send("Unauthorised");
    }

    req.token = token;

    req.user = user;
    req.user_id = decoded.user_id;

    next();
  } catch (e) {
    console.log(e);
    res.status(401).send("Unauthorised");
  }
};
