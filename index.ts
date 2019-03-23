export class Script {
  private readonly _name: string;
  constructor(config) {
    config = { ...config };
    this._name = config.name || 'script';

    this.renderName = this.renderName.bind(this);
  }

  renderName() {
    return this._name;
  }
}

