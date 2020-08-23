import * as vscode from "vscode";

export const showProgress = <T> (title: string, asyncFunc: (done: (msg?: string, increment?: number) => void) => Thenable<T>) => {
  return vscode.window.withProgress({
    cancellable: false,
    location: vscode.ProgressLocation.Notification,
    title
  }, progress => {

    const done = (message?: string, increment?: number) => {
      if (!message && !increment) {
        increment = 100
      }

      progress.report({ increment: 100, message });
    }
    return asyncFunc(done);
  })
}

export const showInfoMessage = (msg: string): Thenable<string | undefined> => {
  // the showInformationMessage must be manually related by the user
  // It was a very bad experience
  // https://stackoverflow.com/questions/34893733/how-to-programmatically-close-vscode-windows-showinformationmessage-box
  
  return vscode.window.showInformationMessage(msg, {
    modal: false
  })

  // the StatusBarMessage is too subtle.
  // return vscode.window.setStatusBarMessage(msg, 5000)
}