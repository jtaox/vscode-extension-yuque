import Requestable from "./Requestable";
import { AuthInfo, User as UserType } from "./types";


class User extends Requestable {
  constructor(authInfo: AuthInfo) {
    super(authInfo);
  }

  get() {
    const path: string = `/users/${this.authInfo.login}`;
    return this.request<UserType>("get", path);
  }

}

export default User;