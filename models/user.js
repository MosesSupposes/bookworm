var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
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
// hash password before saving to database
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) 
            return next(err);
        user.password = hash;
        next();
    });
});

// authenticate input against database documents
UserSchema.statics.authenticate = (email, password, cb) => {
    User.findOne({ email: email })
        .exec((error, user) => {
            if (error) {
                return cb(error)
            }
            else if (!user) {
                let err = new Error('User not found');
                err.status = 401;
                return cb(err)
            }
            bcrypt.compare(password, user.password, (error, result => {
                if (result) 
                    return cb(null, user)
                else 
                    return cb();
            }));
        });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;