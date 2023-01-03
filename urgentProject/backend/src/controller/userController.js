const userModel = require("../model/userModel");
const loginChanceModel = require("../model/loginChance")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const userData = { firstName, lastName, email, password };
    const dataCreated = await userModel.create(userData);
    return res.status(201).send({ status: true, data: dataCreated });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const userLogin = async (req, res) => {
  try {
    const myEmail = req.body.email;
    const myPassword = req.body.password;
    let user = await userModel.findOne({ email: myEmail });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Credentials" });
    }
    const { _id, firstName, lastName, email, password, loginChance } = user;

    if (loginChance <= 0) {
      await loginChanceModel.create({ userName: email, userId: _id })
      await userModel.findOneAndUpdate({ email: myEmail }, { loginChance: 5 });
      return res.status(400).send({ status: false, message: "Due to multiple wrong attempt your login is blocked for next 24 hours Please try after 24 Hours" });
    }

    let findloginChanceExpired = await loginChanceModel.findOne({ userName: email, userId: _id });
    if (findloginChanceExpired) {
      return res.status(400).send({ status: false, message: "Due to multiple wrong attempt your login is blocked for next 24 hours Please try after 24 Hours" });
    }
  
    const validPassword = await bcrypt.compare(myPassword, password);
    if (!validPassword) {
      await userModel.findOneAndUpdate({ email: myEmail }, { loginChance: loginChance - 1 });
      return res.status(400).send({ message: "Invalid Password" });
    }
    let payload = { userId: _id, email: email };
    const generatedToken = jwt.sign(payload, "rupali-secret-key", {
      expiresIn: "10080m",
    });
    res.header("user-login-key", generatedToken);
    return res.status(200).send({
      status: true,
      message: `${firstName} ${lastName} you have logged in Succesfully`,
      data: {
        userId: user._id,
        token: generatedToken,
      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  const details = await userModel.findOne({ _id: req.userId });
  return res.status(200).send({ status: true, msg: "successful", details });
};

module.exports = { registerUser, userLogin, getUser };
