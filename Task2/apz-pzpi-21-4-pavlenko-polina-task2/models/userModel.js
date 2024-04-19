const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please fill in yout name"],
    },
    email: {
      type: String,
      required: [true, "Please fill in your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Provide a valid email"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    books: [
      {
        id: {
          type: mongoose.Schema.ObjectId,
          ref: "Book",
          required: true,
        },
        status: {
          type: String,
          enum: ["Want to read", "Reading", "Finished"],
          default: "Want to read",
        },
        rating: {
          type: Number,
          default: null,
          min: [1, "Rating must be above 1.0"],
          max: [5, "Rating must be below 5.0"],
        },
        notes: {
          type: String,
          default: "Write your thoughts here...",
        },
        addedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Confirm your password"],
      validate: {
        //this only works on CREATE AND SAVE!!!!
        validator: function (passwordConfirm) {
          return passwordConfirm === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  //only run this function if password was modified or user was created
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete confirmed password field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  checkPassword,
  userPassword
) {
  return await bcrypt.compare(checkPassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //Password was changed after jwt token was given
    return JWTTimestamp < changedTimestamp;
  }
  //False means that password not changed
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
