const Listing = require("../models/listing");
const Review = require("../models/review");


//Create Review
module.exports.createReview = async (req,res)=> {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");

    console.log("New Review Saved");
    res.redirect(`/listings/${id}`);
}



//Destroy Review
module.exports.destroyReview = async(req,res)=> {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}