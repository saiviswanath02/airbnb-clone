const User = require("../models/user");


//Render Signup form
module.exports.renderSignup = (req,res)=> {
    res.render("users/signup.ejs");
}

//createNewUser
module.exports.createNewUser = async (req,res)=> {
    try{
        let{username,email,password}= req.body;
    let newUser = new User({username,email});
    let registeredUser = await User.register(newUser,password);
    req.flash("success","Welcome to Wanderlust! You're successfully registered");
    console.log(registeredUser);
    req.login(registeredUser,(err)=> {
        if(err){
            return next(err);
        }
        req.flash("success", "you're successfully signedup");
        res.redirect("/listings");
    })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}


//render Login form
module.exports.renderLoginForm = (req,res)=> {
    res.render("users/login.ejs");
}

//login
module.exports.login = (req,res)=>{
    let{username}=req.body;
    req.flash("success",`${username} Logged in Successfully`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout
module.exports.logout = (req,res,err)=> {
    req.logout((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully logged out");
        res.redirect("/listings");
    })
}