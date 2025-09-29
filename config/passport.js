const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../modules/login/models/users'); // Adjust if needed
const bcrypt = require('bcrypt');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
  //callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    //const existingUser = await User.findOne({ googleId: profile.id });
    const existingUser = await User.findOne({ email });

    const passwordHash = await bcrypt.hash(crypto.randomUUID(), 10);//temp password to avoid error on validation login

    if (existingUser) {
      if (!existingUser.googleId) {
        existingUser.verified = true;
        existingUser.googleId = profile.id;
        existingUser.name = profile.displayName,

        await existingUser.save();
      }

      return done(null, existingUser);
    }

    const newUser = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      verified: true,
      password: passwordHash,
    });

    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/*********** facebook ****************/
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name', 'displayName'] // Important
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.facebookId) {
        user.facebookId = profile.id;
        await user.save();
      }
      return done(null, user);
    }

    const newUser = await User.create({
      facebookId: profile.id,
      email: email,
      name: profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`,
      verified: true,
    });

    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));