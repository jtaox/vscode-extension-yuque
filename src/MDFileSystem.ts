import * as vscode from "vscode"
import { TextEncoder, TextDecoder } from "util";

import querystring from "querystring";

import YuqueVSC from "./YuqueVSC";
import YuqueEventTower from "./YuqueEventTower";

class MDFileSystem implements vscode.FileSystemProvider {

  private _onDidChangeFile: vscode.EventEmitter<vscode.FileChangeEvent[]>;

    constructor() {
        this._onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    }
  
  get onDidChangeFile(): vscode.Event<vscode.FileChangeEvent[]> {
    return this._onDidChangeFile.event;
  }
  
  watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[] }): vscode.Disposable {
    const dispose = YuqueEventTower.getIns().onDidChangeFile((evt) => {

      this._onDidChangeFile.fire([
        {
          uri: evt.uri,
          type: evt.type
        } as vscode.FileChangeEvent
      ])
    })

    return { dispose: () => {
      dispose.dispose()
    } };
  }
  stat(uri: vscode.Uri): vscode.FileStat | Thenable<vscode.FileStat> {
    const { respId, slug } = querystring.decode(uri.query);

    return YuqueVSC.getInstance().getDoc({
      repoId: respId as string,
      slug: slug as string
    }).then(result => {
      const { created_at, updated_at, word_count } = result.data
      
      const getTime = (...dates: string[]): number[] => dates.map(date => new Date(date).getTime());
      const stat = new YuqueDocStat(word_count, getTime(created_at, updated_at));
      console.log(stat, "stat")
      return stat
    })

  }
  readDirectory(uri: vscode.Uri): [string, vscode.FileType][] | Thenable<[string, vscode.FileType][]> {
    throw new Error("Method not implemented.")
  }
  createDirectory(uri: vscode.Uri): void | Thenable<void> {
    throw new Error("Method not implemented.")
  }
  readFile(uri: vscode.Uri): Uint8Array | Thenable<Uint8Array> {
    const { respId, slug } = querystring.decode(uri.query);
    return YuqueVSC.getInstance().getDoc({
      repoId: respId as string,
      slug: slug as string
    }).then(result => {
      const { body } = result.data
      // string to Uint8Array
      const conent = body + Date.now() || ""
      console.log("获取yuque", conent, result.data)
      return new TextEncoder().encode(conent);
    })
  }
  writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean }): void | Thenable<void> {
    const { respId, slug, docId, title } = querystring.decode(uri.query);
    console.log("save start", uri, new TextDecoder("utf-8").decode(content), options, "save end")
    console.log({
      title: title as string,
      slug: slug as string,
      public: 1,
      body: new TextDecoder("utf-8").decode(content),
      id: Number(docId),
      repoId: Number(respId)
    })
    return YuqueVSC.getInstance().updateDoc({
      title: title as string,
      slug: slug as string,
      public: 1,
      body: new TextDecoder("utf-8").decode(content),
      id: Number(docId),
      repoId: Number(respId)
    }).then(result => {
      console.log("update complete", result.data)
    })
  }
  delete(uri: vscode.Uri, options: { recursive: boolean }): void | Thenable<void> {
    console.log("readDirectory delete")
    throw new Error("Method not implemented.")
  }
  rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void | Thenable<void> {
    throw new Error("Method not implemented.")
  }
  public static register() {
    vscode.workspace.registerFileSystemProvider("yuque", new MDFileSystem())
  }
}

class YuqueDocStat implements vscode.FileStat {
  public ctime: number;
  public mtime: number;
  public type: vscode.FileType = vscode.FileType.File;
  constructor( public size: number, dates: number[]) {
    this.ctime = dates[0];
    this.mtime = dates[1]
  }
  
}

export default MDFileSystem