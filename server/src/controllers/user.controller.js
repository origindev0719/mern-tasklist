const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const salt = 10;

export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.json({ error: "Failed to create user" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      res.json({ error: "Invalid Email" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      res.json({ error: "Invalid Password" });
    }
    const token = jwt.sign({ user_id: user._id, email }, jwtSecretKey, {
      expiresIn: "10min",
    });

    user.token = token;

    res.json(user);
  } catch (err) {
    console.log(err, "error");
  }
};

export const validAuth = (req, res) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    res.json(decoded);
  } catch (error) {
    console.log(error, "error");
  }
};
