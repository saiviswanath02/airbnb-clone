const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});


//passport used as plugin to automatically create username,password and salting and hashing to those fields
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);