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
}

export type Repo = {
  id: number,
  name: string,
  slug: string,
  namespace: string,
  description: string
}

export type AuthInfo = {
  token: string,
  login: string,
}

export type User = {
  id: number,
  login: string,
  name: string
}