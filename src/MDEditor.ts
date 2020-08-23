import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { tagHandler } from "./helper/template";
import YuqueEventTower from "./YuqueEventTower";

class MDEditor implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MDEditor(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      MDEditor.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "yuque";

  constructor(private readonly context: vscode.ExtensionContext) {

  }

  resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    const yuqueDocUri = document.uri

    const initBody = document.getText()

    const webviewIns = webviewPanel.webview;

    webviewIns.options = {
      enableScripts: true,
    };

    const filePath: vscode.Uri = vscode.Uri.file(
      path.join(
        this.context.extensionPath,
        "src",
        "editor",
        "dist",
        "index.html"
      )
    );
    const templateContent = fs.readFileSync(filePath.fsPath, "utf8");

    const html = tagHandler(
      webviewIns,
      templateContent,
      this.context.extensionPath
    );

    webviewIns.html = html;

    webviewIns.postMessage({
      command: "vscBaseMarkdown.setContent",
      payload: initBody,
    });
    webviewIns.onDidReceiveMessage(
      (message) => {
        console.log(message, 'message')
        if (message.command !== "vsc-base-markdown") return;
        switch (message.action) {
          case "vscBaseMarkdown.mounted":
            console.log("vscBaseMarkdown.mounted");
            return;

          case "vscBaseMarkdown.onChange":
            // I'm not sure what the point of writing that is
            // YuqueEventTower.getIns().fireFileChangeEvent(yuqueDocUri);
            this.updateTextDocument(document, message.text)
            return;
        }
      },
      undefined,
      // context.subscriptions
    );

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
        // listen for text changes here...
        // e.g. sending a message to webview
			}
    });

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});
  }

  // write doc to a given document
  private updateTextDocument(document: vscode.TextDocument, content: string) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), content)

    return vscode.workspace.applyEdit(edit);
  }
}

export default MDEditor;
