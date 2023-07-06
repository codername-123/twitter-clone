import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    target_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// So that user can't just follow a person again and again
followSchema.index({ user_id: 1, target_user_id: 1 }, { unique: true });

const FollowModel = mongoose.model("follows", followSchema);

export default FollowModel;
