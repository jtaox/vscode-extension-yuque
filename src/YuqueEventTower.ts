import * as vscode from "vscode"

class YuqueEventTower extends vscode.EventEmitter<vscode.FileChangeEvent> {
  private static tower: YuqueEventTower;
  static getIns() {
    if (!YuqueEventTower.tower) {
      YuqueEventTower.tower = new YuqueEventTower();
    }

    return YuqueEventTower.tower;
  }

  constructor() {
    super();
  }

  get onDidChangeFile() {
    return this.event;
  }

  public fireFileChangeEvent(uri: vscode.Uri) {
    this.fire({
      uri,
      type: vscode.FileChangeType.Changed
    })
  }

  public onFileChangeEvent(listener: (e: vscode.FileChangeEvent) => any): vscode.Disposable {
    return this.event(listener);
  }

}

export default YuqueEventTower;