const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



//post review Request
//Creating a review
router.post("/",isLoggedIn, validateReview, reviewController.createReview);


//Delete review request
//Deleting a new review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;