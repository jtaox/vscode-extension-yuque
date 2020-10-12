import * as vscode from "vscode";
import YuqueVSC from "../YuqueVSC";
import { Repo } from "../types";

type AdvPick = vscode.QuickPickItem & { _raw: Repo };

export const showRepoPick = (): Thenable<AdvPick | undefined> => {

  const quickPickItem: Thenable<AdvPick[]> = YuqueVSC.getInstance().getRepo().then(res => {
    return res.data.map(item => {
      return {
        label: item.name,
        description: "desc",
        detail: "detail",
        _raw: item
      };
    });
  });

  return vscode.window.showQuickPick(quickPickItem, {
    placeHolder: "点击选择一个知识库"
  }).then(selection => {
    if (!selection) {
      return;
    }

    return selection;
  });
};