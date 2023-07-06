import { object, string } from "zod";

export const followUserSchema = object({
  body: object({
    username: string({
      required_error: "Username in params is required",
    }),
    targetUsername: string({
      required_error: "Username of the user to follow is required",
    }),
  }).refine((data) => data.username !== data.targetUsername, {
    message: "User cannot follow itself",
    path: ["username", "targetUsername"],
  }),
});

// There might be a better way to reuse the above code
export const unfollowUserSchema = object({
  body: object({
    username: string({
      required_error: "Username in params is required",
    }),
    targetUsername: string({
      required_error: "Username of the user to follow is required",
    }),
  }).refine((data) => data.username !== data.targetUsername, {
    message: "User cannot unfollow itself",
    path: ["username", "targetUsername"],
  }),
});
