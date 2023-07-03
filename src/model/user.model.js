import mongoose from "mongoose";
import argon2 from "argon2";
import logger from "../utils/winston.js";

export const privateFields = ["password", "__v"];
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    next();
  }

  const hash = await argon2.hash(this.password);
  this.password = hash;
  next();
});

userSchema.methods.validatePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    logger.error("Unable to validate the password");
    logger.debug(error);
    return false;
  }
};

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
