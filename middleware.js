const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //information of current path
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login first to create a new listing ");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}



module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Sorry! you dont have permissions to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","Sorry! you dont have permissions to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//validating listing through joi as a function to pass it as middleware
module.exports.validateListing = (req,res,next) => {
    //taking only error from the result
    let {error} = listingSchema.validate(req.body);
    
    if(error) {
        //With Every error all the details are stored in 'details' object
        //Extracting all the messages of every element 'el' and joining them with ','
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}



//validating review through joi as a function to pass it as middleware
module.exports.validateReview = (req,res,next) => {
    //taking only error from the result
    let {error} = reviewSchema.validate(req.body);
    
    if(error) {
        //With Every error all the details are stored in 'details' object
        //Extracting all the messages of every element 'el' and joining them with ','
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
}