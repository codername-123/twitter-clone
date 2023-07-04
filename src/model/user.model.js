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
    username: {
      type: String,
      unique: true,
      lowercase: true,
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
    profilePicture: {
      type: String,
      default:
        "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
      required: false,
    },
    headerPicture: {
      type: String,
      default:
        "https://business.twitter.com/content/dam/business-twitter/textured-backgrounds/banner-full-blue-scratch.jpg.twimg.1280.jpg",
      required: false,
    },
    bio: {
      type: String,
      default: "",
      maxLength: 160,
      required: false,
    },
    location: {
      type: String,
      default: "",
      required: false,
    },
    follower_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    following_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    frontendTheme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
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
