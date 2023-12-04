import Entity from './Entity';

export class Tags implements Entity {
  public id?: string;
  public title = '';
  public color = '';

  constructor(initData: Partial<Tags>) {
    Object.assign(this, initData);
  }
}
