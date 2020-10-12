export { CrateDocParam, UpdateDocParam } from "./Doc";

export type Doc = {
  id: number,
  title: string,
  slug: string,
  body_html: string,
  body: string,
  created_at: string,
  updated_at: string,
  word_count: number,
  __repoId: number
};

export type Repo = {
  id: number,
  name: string,
  slug: string,
  namespace: string,
  description: string,
  type: string,
  user_id: number,
  creator_id: number,
  public: 1 | 0,
  create_at: string,
  update_at: string
};

export type AuthInfo = {
  token: string,
  login: string,
};

export type User = {
  id: number,
  login: string,
  name: string
};