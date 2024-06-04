const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




//show Index Page of All Listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // for(listing of allListings){
    //     console.log(listing.price);
    // }
    res.render("./listings/index.ejs", { allListings });
}

//New form
module.exports.renderNewForm = (req, res) => {

    res.render("./listings/newform.ejs");
}

//Create New Listing
module.exports.createNewListing = async (req, res) => {
    // let {title:title, description:description, image:image, price:price, location:location, country: country} = req.body;
    // let newListing = new Listing({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country: country
    // });
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Please send valid data");
    // }
    //Validating Schema Using Joi
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
        

    console.log(response.body.features[0].geometry);
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let listingResult = await newListing.save();
    console.log(listingResult);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}


//Update Listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();

    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

//showListing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
}

//render edit form
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listings");
    }

    //Image Pixel decreasing with cloudinary
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/editform.ejs", { listing,originalImageUrl });
}


//Destroy Listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    console.log(deletedListing);
    res.redirect("/listings");
}