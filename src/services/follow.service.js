import mongoose from "mongoose";
import WebError from "../errors/web.error.js";
import FollowModel from "../model/follower.model.js";
import UserModel from "../model/user.model.js";
import errorMessages from "../utils/errorMessages.js";
import logger from "../utils/winston.js";

const {
  SOMETHING_WENT_WRONG_ERROR,
  USER_DOES_NOT_EXIST_ERROR,
  UNABLE_TO_FIND_USER_TO_FOLLOW_ERROR,
  ALREADY_FOLLOWS_ERROR,
  UNABLE_TO_FIND_USER_TO_UNFOLLOW_ERROR,
  DOES_NOT_FOLLOW_ERROR,
} = errorMessages;

// Some blog posts on MongoDB transactions using Mongoose
// 1. http://thecodebarbarian.com/a-node-js-perspective-on-mongodb-4-transactions.html
// 2. https://velog.io/@rosewwross/Using-Transaction-in-Mongoose
// 3. https://blog.tericcabrel.com/how-to-use-mongodb-transaction-in-node-js/

/**
 * MongoDB transactions works in a specific case(when MongoDB is set up as replica set or sharded cluster).
 * Transactions are not supported on standalone deployments.
 * If you are using a local mongoDb instance transaction will not work.
 * You don't have to worry if you are using mongoDb Atlas.
 *
 * (https://www.youtube.com/watch?v=bdS03tgD2QQ)
 */

export async function followUser(username, target_username) {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const user = await UserModel.findOne({ username: username }).session(
      session
    );
    if (!user) {
      throw new WebError(
        USER_DOES_NOT_EXIST_ERROR.status,
        USER_DOES_NOT_EXIST_ERROR.message
      );
    }
    // For testing
    // console.log(`user -> ${user}`);

    const targetUser = await UserModel.findOne({
      username: target_username,
    }).session(session);
    if (!targetUser) {
      throw new WebError(
        UNABLE_TO_FIND_USER_TO_FOLLOW_ERROR.status,
        UNABLE_TO_FIND_USER_TO_FOLLOW_ERROR.message
      );
    }
    // For testing
    // console.log(`targetUser -> ${targetUser}`);

    // User cannot follow itself (this is handled in the zod schema)
    // if (user.username === targetUser.username) {
    // }

    const followDocument = await FollowModel.create(
      [
        {
          user_id: user._id,
          target_user_id: targetUser._id,
        },
      ],
      { session }
    );

    await UserModel.updateOne(
      { _id: targetUser._id },
      { $inc: { follower_count: 1 } },
      { session }
    );

    await UserModel.updateOne(
      { _id: user._id },
      { $inc: { following_count: 1 } },
      { session }
    );

    // commit the transaction
    await session.commitTransaction();

    return followDocument;
  } catch (error) {
    // abort transaction
    await session.abortTransaction();

    if (error instanceof WebError) {
      throw error;
    }

    // 11000 means unique key validation error
    if (error.code === 11000) {
      throw new WebError(
        ALREADY_FOLLOWS_ERROR.status,
        ALREADY_FOLLOWS_ERROR.message(username, target_username)
      );
    }

    throw new WebError(
      SOMETHING_WENT_WRONG_ERROR.status,
      SOMETHING_WENT_WRONG_ERROR.message
    );
  } finally {
    session.endSession();
    logger.info("Follow user session ended");
  }
}

export async function unfollowUser(username, target_username) {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const user = await UserModel.findOne({ username: username }).session(
      session
    );
    if (!user) {
      throw new WebError(
        USER_DOES_NOT_EXIST_ERROR.status,
        USER_DOES_NOT_EXIST_ERROR.message
      );
    }
    // For testing
    // console.log(`user -> ${user}`);

    const targetUser = await UserModel.findOne({
      username: target_username,
    }).session(session);
    if (!targetUser) {
      throw new WebError(
        UNABLE_TO_FIND_USER_TO_UNFOLLOW_ERROR.status,
        UNABLE_TO_FIND_USER_TO_UNFOLLOW_ERROR.message
      );
    }
    // For testing
    // console.log(`targetUser -> ${targetUser}`);

    // User cannot follow itself (this is handled in the zod schema)
    // if (user.username === targetUser.username) {
    // }

    const relation = await FollowModel.findOneAndDelete({
      user_id: user._id,
      target_user_id: targetUser._id,
    }).session(session);

    if (!relation) {
      throw new WebError(
        DOES_NOT_FOLLOW_ERROR.status,
        DOES_NOT_FOLLOW_ERROR.message(username, target_username)
      );
    }

    // Although I can't think of a scenario where you will be able to decrease following or
    // follower count below zero because we check first if the follower followee relation
    // exists in the follower model

    // Here I'm checking whether if the follower count is greater than or equal to 1
    // because if it is less than 1 that means follower count is 0 and should not
    // be decreased less than 0
    await UserModel.updateOne(
      { _id: targetUser._id, follower_count: { $gte: 1 } },
      { $inc: { follower_count: -1 } },
      { session }
    );

    // Here I'm checking whether if the following count is greater than or equal to 1
    // because if it is less than 1 that means following count is 0 and should not
    // be decreased less than 0
    await UserModel.updateOne(
      { _id: user._id, following_count: { $gte: 1 } },
      { $inc: { following_count: -1 } },
      { session }
    );

    // commit the transaction
    await session.commitTransaction();
  } catch (error) {
    // abort transaction
    await session.abortTransaction();

    if (error instanceof WebError) {
      throw error;
    }

    throw new WebError(
      SOMETHING_WENT_WRONG_ERROR.status,
      SOMETHING_WENT_WRONG_ERROR.message
    );
  } finally {
    session.endSession();
    logger.info("Unfollow User Session Ended");
  }
}

/**
 * ?: Given a user find the username of the users that follow the user
 * db.follows.aggregate([
  {
    $match: {
      target_user_id: "given_user_id"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $project: {
      _id: 0,
      username: "$user.username"
    }
  }
])
 */

/**
 * ?: Given a user find the username of the users that user is following 
 * db.follows.aggregate([
  {
    $match: {
      user_id: "given_user_id"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "target_user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $project: {
      _id: 0,
      username: "$user.username"
    }
  }
])
 */
