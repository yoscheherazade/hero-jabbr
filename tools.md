# Dependencies

* Express - NodeJS framework (used to construct a lot of the routes/URLs)

* Morgan - log user http requests to server

* Body-Parser - read data from form fields on front end

* Mongoose - object/relational mapper, helps create, find, read documents on MongoDB

* HBS - templating engine

* bcrypt - for encrypting users' passwords and saving to database

* crypto - a JS implementation of standard and secure cryptographic algorithms (using for photos)

* passport - for authenticating users

* express-flash - used to manage user sessions and send flash messages

* express-session - in-memory storage, works for a certain period of time

* connect-mongo - stores sessions

* socket.io - for real time communication

# Connecting Node app to Mongo Server

1. Set up mlab database
1. Create a root or admin user on database
1. Grab database key from mlab. Copy the link under "To connect using a driver or the standard MongoDB URI".
1. Create a config folder
1. Create a secret.js file within the config folder
1. Set up a module to export a property named database set to the value copied from mlab
1. Set up config variable in main server.js file to require secret
1. Use mongoose to connect to db using database info stored in config var
mongoose.connect(config.database, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Connected to the Database");
});

//TODO:
1. While logged in, pressing back more than once crashes app. (Err: Can't set headers after they are sent)
1. Make landing page responsive
1.
