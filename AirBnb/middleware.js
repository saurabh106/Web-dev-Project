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
};

//saveRedirectUrl -> when you login saveRedirectUrl save then only you login using passport then req.session the url deleted then you redirected to req.local.redirectUrl;
// When you login -> the passport reset the req.session. that why we nedd to store that in locals
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

 