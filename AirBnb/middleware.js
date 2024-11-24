// This middlewares for to see user authenticated or not 

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // redirectUrl save -> 
        // If user want to access any path  - then we need to login first then - when login they redirect to the same path that are they accessing before login
       
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing");
       return  res.redirect("/login");
    }
    next();
}
