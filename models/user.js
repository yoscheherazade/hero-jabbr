const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  name: String,
  password: String,
  photo: String,
  woofs: [{
    woof: {
      type: Schema.Types.ObjectId,
      ref: 'Woof'
    }
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// encrypt pw before saving
UserSchema.pre('save', function (next) {
  let user = this; // accept UserSchema via closure
  if (!user.isModified('password')) { // if user is not modified, move on
    return next();
  }
  if (user.password) { // if user.password !== null, generate a string of 10 chars, hash it and set to user PW
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next();
        }
        user.password = hash;
        next(err);
      })
    })
  }
});

// create a custom method for creating user photo(gravatar method for user photo)
UserSchema.methods.gravatar = function (size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=robohash';
  }
  let md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=robohash';
};

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
