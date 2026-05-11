const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        // proxy: true // 之後如果部署到 Heroku 或 Render 需要這行
    },
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.findOne({ email: email });

            if (user) {
                user.googleId = profile.id;
                await user.save();
            } else {
                user = await User.create({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: email
                })
            }
        }
        return done(null, user)
    }
));

module.exports = passport;
