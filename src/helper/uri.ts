import * as vscode from "vscode";
import qs from "querystring";

import YqExtConfig from "./../config";
// yuque://abc/def.yuque?respId=${doc.__repoId}&slug=${doc.slug}&docId=${doc.id}&title=${doc.title}`;
const YUQUE_SCHEMA = "yuque";
const YUQUE_SUFFIX = "yuque";

const YUQUE_LOGIN = YqExtConfig.getInstance().getBaseConfig().login;

type YuqueUriParam = {
  repo: string
  slug: string
  docId: number
  title: string
}

type YuqueUriParseQueryResult = {
  docId: string
  title: string
  [name: string]: string
}

type YuqueUriParseResult = {
  repo: string
  slug: string
  query: YuqueUriParseQueryResult
}

export const buildYuqueUri = (params: YuqueUriParam) => {
  const query: { [name: string]: string } = {
    title: params.title,
    docId: String(params.docId)
  };

  return vscode.Uri.parse(
    [
      YUQUE_SCHEMA,
      "://",
      YUQUE_LOGIN,
      "/",
      [params.repo, params.slug].join("/"),
      `.${YUQUE_SUFFIX}`,
      "?",
      Object.keys(query)
        .map((k) => `${k}=${query[k] as string}`)
        .join("&"),
    ].join("")
  );
};

export const parseYuqueUri = (uri: vscode.Uri): YuqueUriParseResult => {
  const query = (qs.parse(uri.query) || {}) as YuqueUriParseQueryResult;

  const pathFragmeng = uri.path.replace(/\.yuque$/, "").split('/')
  pathFragmeng.shift()

  const [repo, slug] = pathFragmeng;

  return {
    repo,
    slug,
    query
  }
}
