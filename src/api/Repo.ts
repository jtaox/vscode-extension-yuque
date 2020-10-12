import Requestable from "./Requestable";
import { AuthInfo, Repo as RepoType } from "./types";

class Repo extends Requestable {
  constructor(authInfo: AuthInfo) {
    super(authInfo);
  }

  list(data?: any) {
    const path: string = `/users/${this.authInfo.login}/repos`;
    return this.request<RepoType[]>("get", path, data);
  }

}

export default Repo;