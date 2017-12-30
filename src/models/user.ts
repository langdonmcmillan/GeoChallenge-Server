import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt-nodejs";

const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
    userName: string;
    email?: string;
    password?: string;

    comparePassword?: (
        enteredPassword: string,
        callback: (error: Error, isMatch: Boolean) => void
    ) => void;
}

const userSchema = new Schema({
    userName: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    password: { type: String, required: true }
});

userSchema.pre("save", function(next) {
    const user = this;
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function(error, salt) {
            if (error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, undefined, function(error, hash) {
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

userSchema.methods.comparePassword = function(
    enteredPassword: string,
    callback: (error: Error, isMatch: Boolean) => {}
) {
    bcrypt.compare(enteredPassword, this.password, function(error, isMatch) {
        callback(error, isMatch);
    });
};

export const User: mongoose.Model<IUser> = mongoose.model<IUser>(
    "User",
    userSchema
);
