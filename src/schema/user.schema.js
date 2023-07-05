import { object, string } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is a required property to create user",
    }),
    username: string({
      required_error: "UserName is required property to create user",
    }),
    email: string({
      required_error: "Email is a required property to create user",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password word is required to  create user",
    }).min(6, "Minimum length of a password is 6 characters"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    profilePicture: string().optional(),
    headerPicture: string().optional(),
    bio: string()
      .max(160, "Bio can only have maximum 160 characters")
      .optional(),
    location: string().optional(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const getByUsernameSchema = object({
  params: object({
    username: string({
      required_error: "username is required to find the user",
    }),
  }),
});
