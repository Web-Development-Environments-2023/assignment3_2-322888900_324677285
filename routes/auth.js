var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt"); 


router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
      profilePic: req.body.profilePic
    }
    let users = [];
   
    users = await DButils.execQuery("SELECT user_name from users");
    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
     '${hash_password}', '${user_details.country}', '${user_details.email}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT * FROM users");
    if (!users.find((x) => x.user_name === req.body.username))
      throw { status: 401, message: " 1 Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE user_name = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.h_password)) {
      throw { status: 401, message: " 2 Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_name;
    res.cookie("user_id", user.user_name)
    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;