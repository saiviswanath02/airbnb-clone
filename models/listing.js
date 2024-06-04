const mongoose = require("mongoose");
const Review = require("./review.js");
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description:String,
    image:{
        url: String,
        filename: String
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            // model name for ref
            ref:"Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

//post mongoose middleware to delete reviews after deleting listing
listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
})


module.exports = mongoose.model("Listing",listingSchema);