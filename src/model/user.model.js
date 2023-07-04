import mongoose from "mongoose";
import argon2 from "argon2";
import logger from "../utils/winston.js";

export const privateFields = ["password", "__v"];
const userModelSchema = new mongoose.Schema(
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

userModelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hash = await argon2.hash(this.password);

  this.password = hash;

  return next();
});

userModelSchema.methods.validatePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    logger.error("Unable to validate the password");
    logger.debug(error);
    return false;
  }
};

const UserModel = mongoose.model("users", userModelSchema);

export default UserModel;
