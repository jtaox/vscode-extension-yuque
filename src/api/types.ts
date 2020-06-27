export type Doc = {
  id: number,
  title: string,
  slug: string,
  body_html: string,
  body: string,
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