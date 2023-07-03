import UserModel from "../model/user.model.js";

export async function createUser(input) {
  return UserModel.create(input);
}
