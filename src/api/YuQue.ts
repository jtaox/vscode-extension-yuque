import Repo from "./Repo";
import { AuthInfo } from "./types";
import Doc from "./Doc";



class YuQue {
  constructor(private authInfo: AuthInfo) {
  }

  get Repo(): Repo {
    return new Repo(this.authInfo);
  }

  get Doc(): Doc {
    return new Doc(this.authInfo);
  }
}

export default YuQue;
