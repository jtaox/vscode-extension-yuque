import * as vscode from "vscode";
import YuqueVSC from "../YuqueVSC";


export const showDocTitleInputBox = (value?: string) => {
  return vscode.window.showInputBox({
    prompt: "文档标题",
    placeHolder: "请输入文档标题",
    value
  });
};