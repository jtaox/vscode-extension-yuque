import YuQue from "./api/YuQue";
import BaseYqConfig from "./config"
import { CrateDocParam, UpdateDocParam } from "./types"

type YuqueVscConfig = {
  token: string
  login: string
}

type DocInfoParam = {
  repoId: string
  slug: string
}


class YuqueVSC {
  private static yuque: YuqueVSC;
  static getInstance(): YuqueVSC {
    if (!YuqueVSC.yuque) {
      const baseConfig = BaseYqConfig.getInstance().getBaseConfig()
      YuqueVSC.yuque = new YuqueVSC(baseConfig)
    }

    return YuqueVSC.yuque;
  }

  private yuque: YuQue;

  constructor(private readonly config: YuqueVscConfig) {
    this.yuque = new YuQue(this.config);
  }

  public getDoc(params: DocInfoParam) {
    return this.yuque.Doc.get(Number(params.repoId), params.slug)
  }

  public createDoc(params: CrateDocParam) {
    return this.yuque.Doc.create(params);
  }

  public updateDoc(params: UpdateDocParam) {
    return this.yuque.Doc.update(params);
  }
  
  public getRepo() {
    return this.yuque.Repo.list({
      type: "Book"
    })
  }
}

export default YuqueVSC;