const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { findByUsername } = require("./db/users");

const initialize = (passport) => {
  const authenticateUser = async (username, password, done) => {
    try {
      const user = await findByUsername(username);
      if (!user) {
        return done(null, false, {
          message: "No user with that username.",
        });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };
  passport.use(
    new LocalStrategy({
      usernameField: "username"
    }, authenticateUser)
  );
  
  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findByUserId(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

module.exports = initialize;
