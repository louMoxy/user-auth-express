var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// Authenticate input against db doc
UserSchema.statics.authenticate = (email, pass, callback) => {
  User.findOne({email})
    .exec((error, user) => {
      if(error){
        return callback(error);
      } else if(!user){
        var err = new Error('User not found');
        err.status = 401;
        return callback(err); 
      }
      bcrypt.compare(pass, user.password, (error, result) => {
        if(result){
          return callback(null, user);
        } else {
          return callback();
        }
      })
  })
}


// Pre save hook
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if(err){
      return next(err);
    }
    user.password =hash;
    next();
  })
})

var User = mongoose.model('User', UserSchema);
module.exports = User;