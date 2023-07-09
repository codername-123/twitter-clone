import { object, string } from "zod";
export const loginSchema = object({
  body: object({
    email: string({ required_error: "Email is required to login" }).email(
      "Invalid email or password"
    ),
    password: string({
      required_error: "Invalid email or password",
    }).min(6, "Minimum length of a password is 6 characters"),
  }),
});
