import Requestable from "./Requestable";
import { AuthInfo, Doc as DocType } from "./types";

export type UpdateDocParam = {
  repoId: number
  slug: string,
  id: number,
  title: string,
  public: 0 | 1,
  body: string
};

export type CrateDocParam = {
  repoId: number 
  title: string 
  public: 0 | 1,
  body: string
};

class Doc extends Requestable {
  constructor(authInfo: AuthInfo) {
    super(authInfo);
  }

  list(repoId: number) {
    const path: string = `/repos/${repoId}/docs`;
    return this.request<DocType[]>("get", path);
  }

  get(repoId: number, slug: string) {
    const path: string = `/repos/${repoId}/docs/${slug}`;
    return this.request<DocType>("get", path, {
      raw: 1
    });
  }

  update(params: UpdateDocParam) {
    const { repoId, id, title, slug, public: publicParam, body } = params;
    const path: string = `/repos/${repoId}/docs/${id}`;
    return this.request<DocType>("PUT", path, {
      title,
      slug,
      public: publicParam,
      body
    });
  }

  create(params: CrateDocParam) {
    const { repoId, title, public: publicParam, body } = params;
    const path: string = `/repos/${repoId}/docs`;
    return this.request<DocType>("POST", path, {
      title,
      public: publicParam,
      body
    });
  }

}

export default Doc;