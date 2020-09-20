// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { RepoProvider } from "./provider/RepoProvider";
import YuQue from "./api/YuQue";
import { Doc } from "./types";
import MDEditor from "./MDEditor";
import YuqueVSC from "./YuqueVSC";
import MDFileSystem from "./MDFileSystem"

import { showRepoPick, showDocTitleInputBox, parseYuqueUri, buildYuqueUri, showProgress, showInfoMessage } from "./helper"
import YuqueDocumentSymbolProvider from "./provider/YuqueDocumentSymbolProvider";

class YuquerTextDocumentContentProvider implements vscode.TextDocumentContentProvider {
  onDidChange?: vscode.Event<vscode.Uri> | undefined 
  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    const { repo, slug } = parseYuqueUri(uri)
    

    return YuqueVSC.getInstance().getDoc({
      repoId: repo as string,
      slug: slug as string
    }).then(result => {
      const { body } = result.data

      return body;
    })
  }
  
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(MDEditor.register(context));
  MDFileSystem.register();

  vscode.workspace.onWillSaveTextDocument((evt) => {
    console.log('onWillSaveTextDocument')
  })

  vscode.workspace.onDidSaveTextDocument(() => {
    console.log("onDidSaveTextDocument")
  })

  // vscode.workspace.registerTextDocumentContentProvider("yuque", new YuquerTextDocumentContentProvider())
  // vscode.workspace.registerFileSystemProvider("yuque", new YuqueFileSystemProvider())

  const { token, login } = vscode.workspace.getConfiguration("yuque");
  const yuque = new YuQue({ token, login });

  const repoProvider = new RepoProvider("Book", yuque)



  vscode.commands.registerCommand("yuque.openDoc", async (doc: Doc) => {
    // yuque.Doc.get(doc.__repoId, doc.slug).then(async (res) => {
      // vscode.workspace.openTextDocument(vscode.Uri.parse("yuque://abcyuque"))
      const uri = buildYuqueUri({
        repo: String(doc.__repoId),
        slug: doc.slug,
        docId: doc.id,
        title: doc.title
      })
      await vscode.commands.executeCommand('vscode.open', uri);

      // const panel = vscode.window.createWebviewPanel(
      //   "Yuque Doc",
      //   res.data.title,
      //   {
      //     preserveFocus: true,
      //     viewColumn: vscode.ViewColumn.One,
      //   },
      //   {
      //     enableScripts: true,
      //   }
      // );

      // const filePath: vscode.Uri = vscode.Uri.file(
      //   path.join(context.extensionPath, "src", "editor", "dist", "index.html")
      // );
      // const templateContent = fs.readFileSync(filePath.fsPath, "utf8");

      // const html = tagHandler(
      //   panel.webview,
      //   templateContent,
      //   context.extensionPath
      // );

      // panel.webview.postMessage({
      //   command: "vscBaseMarkdown.setContent",
      //   payload: res.data.body,
      // });
      // panel.webview.onDidReceiveMessage(
      //   (message) => {
      //     switch (message.command) {
      //       case "vscBaseMarkdown.mounted":
      //         console.log("vscBaseMarkdown.mounted");
      //         return;
      //     }
      //   },
      //   undefined,
      //   context.subscriptions
      // );

      // // And set its HTML content
      // panel.webview.html = html;
    // });
  });

  vscode.window.registerTreeDataProvider(
    "repos-book",
    repoProvider
  );


  // vscode.languages.registerDocumentSymbolProvider({
  //   scheme: "yuque",
  //   language: "*"
  // }, new YuqueDocumentSymbolProvider());

  vscode.commands.registerCommand(
    "yuque.addDoc",
    (...props) =>
      console.log(props)
  );

  vscode.commands.registerCommand("yuque.test", () => {
    console.log('yuque.test')
  })

  vscode.commands.registerCommand(
    "yuque.addDocFromRepo",
    async () => {

      showProgress<string | void>(undefined, async done => {
        const selection =  await showRepoPick()

        const close = () => done()

        if (!selection) return close();

        done(`文档存放仓库: ${selection.label}`, 33)

        const title = await showDocTitleInputBox()

        if (!title?.trim()) return close()

        done(`文档名: ${title}`, 33)
        
        return YuqueVSC.getInstance().createDoc({
          repoId: selection._raw.id,
          title,
          public: 0,
          body: ""
        }).then(res => {
          repoProvider.refresh()
          done()
          return res.data.title;
        })

      }).then(title => {
        title && showInfoMessage(`【${title}】创建成功`)
      })
  )

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
