const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
    userName: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true }
});

userSchema.pre("save", function(next) {
    const user = this;
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function(error, salt) {
            if (error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, null, function(error, hash) {
                if (error) {
                    return next(error);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function(enteredPassword, callback) {
    bcrypt.compare(enteredPassword, this.password, function(error, isMatch) {
        if (error) {
            return callback(error);
        }
        callback(null, isMatch);
    });
};

const ModelClass = mongoose.model("users", userSchema);

module.exports = ModelClass;
