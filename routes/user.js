const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");


router.route("/signup")
    //Render Signup Form
    .get(userController.renderSignup)

    //Create New User after entering details in signup form
    .post(wrapAsync(userController.createNewUser));


router.route("/login")
    //Login pages 
    .get(userController.renderLoginForm)

    //Check Login Credentials
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), userController.login);


//logout
router.get("/logout", userController.logout);



module.exports = router;