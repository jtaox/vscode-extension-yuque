import * as vscode from "vscode";

type BaseYqConfig = {
  token: string
  login: string
};

class YqExtConfig {
  private static configIns: YqExtConfig;
  public static getInstance() {
    if (!YqExtConfig.configIns) {
      YqExtConfig.configIns = new YqExtConfig();
    }

    return YqExtConfig.configIns;
  }

  private baseConfig!: BaseYqConfig;

  constructor() {
    this.readDefaultConfig();
  }

  private readDefaultConfig(): void {
    const { token, login } = vscode.workspace.getConfiguration("yuque");

    this.baseConfig = {
      token,
      login
    };
  }

  getBaseConfig(): BaseYqConfig {
    return this.baseConfig;
  }

}

export default YqExtConfig;