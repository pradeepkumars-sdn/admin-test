const mongoose = require('mongoose');
const Schema = mongoose.Schema;
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

// Define collection and schema
let user = new Schema({
   name: {
      type: String
   },
   email: {
      type: String
   },
   password: {
      type: String
   },
   designation: {
      type: String
   },
   phoneNumber: {
      type: Number
   },
   isDeleted: {
      type: Boolean,
     default:false
   },
   token: { type: String },
   img:
	{
		data: Buffer,
		contentType: String
	}
}, {
   collection: 'user'
})

user.pre('save', function(next) {
   var user = this;

   // only hash the password if it has been modified (or is new)
   if (!user.isModified('password')) return next();

   // generate a salt
   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
       if (err) return next(err);

       // hash the password using our new salt
       bcrypt.hash(user.password, salt, function(err, hash) {
           if (err) return next(err);
           // override the cleartext password with the hashed one
           user.password = hash;
           next();
       });
   });
});
    
// user.methods.comparePassword = function(candidatePassword, cb) {
//    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//        if (err) return cb(err);
//        cb(null, isMatch);
//    });
// };



module.exports = mongoose.model('user', user)