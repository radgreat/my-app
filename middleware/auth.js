const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Max attempts per IP
  handler: (req, res, next) => {
    req.flash('error', 'Too many login attempts. <br> Please wait 1 minute and try again.');
    res.redirect('/auth');
  },
  standardHeaders: true,
  legacyHeaders: false,  
});

function isLoggedIn(req, res, next){
    if(req.session.userId){
        return next();
    }

  req.flash('error', 'You must be logged in');
  res.redirect('/auth');   
}

function isAdmin(req, res, next){
    if (req.session.role === 'admin') {
        return next();
    }

    req.flash('error', 'You must be an Admin.');
    res.redirect('/auth');
}

function ensureLoggedIn(req, res, next) {
  if (req.session.userId) {
    return next(); //session still alive
  }

  req.flash('error', 'Session expired. <br> Please log in again.');
  res.redirect('/auth');
}


module.exports = { isLoggedIn, isAdmin, rateLimiter, ensureLoggedIn };