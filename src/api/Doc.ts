import Requestable from "./Requestable";
import { AuthInfo, Doc as DocType } from "./types";

class Doc extends Requestable {
  constructor(authInfo: AuthInfo) {
    super(authInfo);
  }

  list(repoId: number) {
    const path: string = `/repos/${repoId}/docs`
    return this.request<DocType[]>("get", path);
  }

  get(repoId: number, slug: string) {
    const path: string = `/repos/${repoId}/docs/${slug}`
    return this.request<DocType>("get", path, {
      raw: 1
    })
  }

}

export default Doc