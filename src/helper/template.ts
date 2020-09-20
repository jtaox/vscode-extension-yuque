import cheerio from "cheerio";
import path from "path";
import fs from "fs";
import * as vscode from "vscode";

const EDITOR_RELATIVE_PATH = "src/editor/dist"


export const tagHandler = (webview: vscode.Webview, templateContent: string, extensionPath: string): string => {
  const sourceMap = getSourceMap(extensionPath)
  const $ = cheerio.load(templateContent);

  $("link, script").each(function (index, ele) {
    const attr = ele.tagName === "script" ? "src" : "href"
    let oldHref = $(ele).attr(attr)?.replace("/", "");

    if (!oldHref) {
      return;
    }

    const uri = sourceMap[oldHref];
    if (!uri) {
      return;
    }

    $(ele).attr(attr, webview.asWebviewUri(uri).toString());
  })

  return $.html();
}


interface SourceMap {
  [key: string]: vscode.Uri;
}

export const getSourceMap = (extensionPath: string) => {
  const sourceMap: SourceMap = {}

  const list = fs.readdirSync(path.join(extensionPath, EDITOR_RELATIVE_PATH))
  list.forEach(file => {
    // const [filename, extension] = file.match(/[^\\]*\.(\w+)$/) || [];
    sourceMap[file] = vscode.Uri.file(path.join(extensionPath, EDITOR_RELATIVE_PATH, file))
  })

  return sourceMap;
}
