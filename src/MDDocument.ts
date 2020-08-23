import * as vscode from "vscode";

class MDDocument extends vscode.Disposable implements vscode.CustomDocument {
  uri: vscode.Uri;

}

export default MDDocument
