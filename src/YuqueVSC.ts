import YuQue from "./api/YuQue";
import BaseYqConfig from "./config"

type YuqueVscConfig = {
  token: string
  login: string
}

type DocInfoParam = {
  repoId: string
  slug: string
}

type UpdateDocParam = {
  repoId: number
  slug: string,
  id: number,
  title: string,
  public: 0 | 1,
  body: string
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

  public updateDoc(params: UpdateDocParam) {
    return this.yuque.Doc.update(params);
  }
}

export default YuqueVSC;