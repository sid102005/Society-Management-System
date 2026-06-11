const session = require("express-session");
const MongoStore = require("connect-mongo");

function createSessionMiddleware() {
  const uri = process.env.MONGODB_URI;
  const secret = process.env.SESSION_SECRET;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }

  return session({
    secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  });
}

module.exports = createSessionMiddleware;
