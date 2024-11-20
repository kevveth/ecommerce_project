const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const CustomError = require("./utils/CustomErrorHandler");
const db = {
  ...require('./db/index'),
  users: require('./db/users')
}

const initialize = (passport) => {
  const authenticateUser = async (username, password, done) => {
    try {
      const user = await db.users.fetchUserByName(username);
      if (!user) {
        return done(null, false, {
          message: "Incorrect username",
        });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  };
  
  passport.use(
    new LocalStrategy(authenticateUser)
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.users.fetchUserById(id);
      if (!user) throw new CustomError("User not found", 404)
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

module.exports = initialize;
