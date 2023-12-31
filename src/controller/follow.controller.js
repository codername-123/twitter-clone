import { StatusCodes } from "http-status-codes";
import * as FollowService from "../services/follow.service.js";

//Todo:
// Now that you have basic auth and req.user object is attached to the request
// You don't actually need the username of current user in the body of the request
// Fix this

export async function followUserHandler(req, res) {
  try {
    const { username, targetUsername } = req.body;
    const follow = await FollowService.followUser(username, targetUsername);
    res.status(StatusCodes.CREATED).json({
      data: follow,
      message: `${username} successfully followed ${targetUsername}`,
    });
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
}

export async function unfollowUserHandler(req, res) {
  try {
    const { username, targetUsername } = req.body;
    await FollowService.unfollowUser(username, targetUsername);
    res.status(StatusCodes.CREATED).json({
      data: {},
      message: `${username} successfully unfollowed ${targetUsername}`,
    });
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
}
