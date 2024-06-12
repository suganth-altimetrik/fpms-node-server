var User = require("../models/userModel");

const bcrypt = require("bcryptjs");

exports.login = [
  async (req, res) => {
    try {
      const { email, password } = req.body;

      var getUser = await User.findOne({ email });

      if (!getUser) return res.status(401).json({ error: "User not found" });

      const hash = bcrypt.compareSync(password, getUser.password);

      if (!hash) return res.status(401).json({ error: "Invalid password" });

      getUser.token = await getUser.generateAuthToken();
      getUser.save();

      res.status(200).send({
        response_msg: "User Logged in Successfully",
        data: {
          token: getUser.token,
          user_id: getUser._id,
          email: getUser.email,
          name: getUser.name,
        },
      });
    } catch (err) {
      console.log("🚀 ~ file: login ", err);
      return res.status(500).json({ error: "something went wrong" });
    }
  },
];

exports.register = [
  async (req, res) => {
    const { body } = req;

    const { email, name, password } = body;

    try {
      if (!req.body) {
        res.status(400).json({ error: "Body not specified" });
        return;
      }

      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = await bcrypt.hashSync(password, salt);

      var getUser = await User.findOne({ email });

      if (getUser)
        return res.status(420).json({ error: "Email already exist" });

      const user = new User({
        email,
        name,
        password: hash,
      });

      var response = await user.save();

      var _getUser = await User.findById(response._id);

      _getUser.token = await _getUser.generateAuthToken();
      _getUser.save();

      res.status(201).send({
        response_msg: "User Created & Logged in Successfully",
        data: {
          token: _getUser.token,
          user_id: _getUser._id,
          email: _getUser.email,
          name: _getUser.name,
        },
      });
    } catch (err) {
      console.log("🚀 ~ file: create user ", err);
      return res.status(500).json({ error: "something went wrong" });
    }
  },
];
