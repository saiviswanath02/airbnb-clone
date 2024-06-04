if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");


// const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = "mongodb+srv://saiviswanath:Sairam%40123@cluster0.n50hmko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*60*60,
});

store.on("error",()=> {
    console.log("Error in Mongo Session Store");
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};




app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(session(sessionOptions));
app.use(flash());

//passport related
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for displaying flash message and use them in ejs templates
app.use((req,res,next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

main().then((res)=>{
    console.log("Db connection success");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

app.get("/insert",wrapAsync(async (req,res)=> {
    let sample = new Listing({
        title:"Villa",
        description:"By the Beach",
        price:900,
        location:"Goa",
        country:"India"
    });
    await sample.save();
    res.send("Inserted");
}))



//express router for listings
app.use("/listings",listingRouter);

//express router for reviews
app.use("/listings/:id/reviews",reviewRouter);

//express router for users
app.use("/", userRouter)


//Handling No page found error
app.all('*',(req,res,next)=> {
    next(new ExpressError(404, "Page Not Found"));
})


//error handling middleware
app.use((err,req,res,next)=> {
    let{statusCode = 500,message = "Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
})

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
})