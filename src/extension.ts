// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { RepoProvider } from "./provider/RepoProvider";
import YuQue from "./api/YuQue";
import { Doc } from "./types";
import * as path from "path";
import * as fs from "fs";
import { tagHandler } from "./helper/template";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const { token, login } = vscode.workspace.getConfiguration("yuque");
  const yuque = new YuQue({ token, login });

  vscode.commands.registerCommand("yuque.openDoc", (doc: Doc) => {
    yuque.Doc.get(doc.__repoId, doc.slug).then(async (res) => {
      const panel = vscode.window.createWebviewPanel(
        "Yuque Doc",
        res.data.title,
        {
          preserveFocus: true,
          viewColumn: vscode.ViewColumn.One,
        },
        {
          enableScripts: true,
        }
      );

      const filePath: vscode.Uri = vscode.Uri.file(
        path.join(context.extensionPath, "src", "editor", "dist", "index.html")
      );
      const templateContent = fs.readFileSync(filePath.fsPath, "utf8");

      const html = tagHandler(
        panel.webview,
        templateContent,
        context.extensionPath
      );

      panel.webview.postMessage({
        command: "vscBaseMarkdown.setContent",
        payload: res.data.body,
      });
      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "vscBaseMarkdown.mounted":
              console.log("vscBaseMarkdown.mounted");
              return;
          }
        },
        undefined,
        context.subscriptions
      );

      // And set its HTML content
      panel.webview.html = html;
    });
  });

  vscode.window.registerTreeDataProvider(
    "repos-book",
    new RepoProvider("Book", yuque)
  );

  vscode.commands.registerCommand(
    "yuque.addDoc",
    (...props) =>
      console.log(props)
  );

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "vscode-extension-yuque" is now active!');

  // // The command has been defined in the package.json file
  // // Now provide the implementation of the command with registerCommand
  // // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('vscode-extension-yuque.helloWorld', () => {
  // 	// The code you place here will be executed every time your command is executed

  // 	// Display a message box to the user
  // 	vscode.window.showInformationMessage('Hello World from vscode-extension-yuque!');
  // });

  // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
