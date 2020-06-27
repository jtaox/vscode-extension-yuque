import * as vscode from 'vscode';
import YuQue from "../api/YuQue"
import { AuthInfo, Repo as RepoType, Doc as DocType } from '../types';
import Doc from '../api/Doc';

export class RepoProvider implements vscode.TreeDataProvider<Serializer> {

	constructor(private type: string, private yuque: YuQue) {
	}
	onDidChangeTreeData?: vscode.Event<any> | undefined;

	getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: Serializer | undefined): vscode.ProviderResult<Serializer[]> {
		// 一级repo列表
		if (!element) {
			return this.getRepos();
		}
	
		// 二级doc列表
		if (element.serializer && element.serializer.id) {
			return this.getDocs(element.serializer.id);
		}
		
		return Promise.resolve([]);
	}

	getDocs(repoId?: number): Thenable<Serializer[]> {
		if (!repoId) return Promise.resolve([]);

		const docs = this.yuque.Doc;

		return docs.list(repoId).then(res => {
			return res.data.map(item => {
				item.__repoId = repoId;
				return new Serializer(item.title, vscode.TreeItemCollapsibleState.None, item, "doc")
			})
		});
	}

	getRepos(): Thenable<Serializer[]> {
		const repo = this.yuque.Repo;
		return repo.list({
			type: this.type
		}).then(res => {
			return res.data.map(item => {
				return new Serializer(item.name, vscode.TreeItemCollapsibleState.Collapsed, item, "repo")
			})
		})
	}
}

type SerializerType = "repo" | "doc"

class Serializer extends vscode.TreeItem {
	public command?: vscode.Command;
	constructor(
		public readonly label: string, 
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly serializer: RepoType | DocType,
		public readonly type: SerializerType
	) {
		super(label, collapsibleState);

		if (type === "doc") {
			this.command = this.getDocCommand(this.serializer as DocType);
		}
	}

	getDocCommand(docElement: DocType): vscode.Command {
		return {
			title: "open doc",
			command: "yuque.openDoc",
			arguments: [docElement],
		}
	}
}