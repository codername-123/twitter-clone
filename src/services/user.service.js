import lodash from "lodash";
import UserModel, { privateFields } from "../model/user.model.js";

export async function createUser(input) {
  try {
    const user = await UserModel.create(input);
    return lodash.omit(user.toJSON(), privateFields);
  } catch (e) {
    throw e;
  }
}
