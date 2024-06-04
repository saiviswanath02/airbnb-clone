const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings.js");



router
    .route("/")
    //Listings Get route
    .get(wrapAsync(listingController.index))
    //post req of form
    .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createNewListing));



//create a new listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);



router
    .route("/:id")
    //put request
    .put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    //Every Listing Individual Route
    .get(wrapAsync(listingController.showListing))
    //Delete request
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//Edit Get request
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




module.exports = router;
