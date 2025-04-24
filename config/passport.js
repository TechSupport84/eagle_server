import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      passReqToCallback: true, // Ensures we get accessToken and refreshToken
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            googleId: profile.id,
          });
          await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email, picture: user.picture },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        console.log("✅ Authenticated User:", user);
        console.log("✅ Generated Token:", token);
        console.log("✅ OAuth Access Token:", accessToken);
        console.log("✅ OAuth Refresh Token:", refreshToken || "Not Provided");

        return done(null, { user, token, accessToken, refreshToken: refreshToken || "" });
      } catch (error) {
        console.error("❌ Google OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

// ✅ Fix: Ensure correct user ID serialization
passport.serializeUser((user, done) => {
  done(null, user.user ? user.user.id : user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
