// This middlewares for to see user authenticated or not 

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create a new listing");
       return  res.redirect("/login");
    }
    next();
}
