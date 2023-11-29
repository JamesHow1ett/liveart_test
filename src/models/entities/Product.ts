import Entity from './Entity';

export class Product implements Entity {
  public id?: string;
  public name = '';
  public categoryId = '';
  public description = '';
  public thumbnailSrc = 'https://test.ua/img/logo22.png';
  public thumbnailFile?: File;

  constructor(initData: Partial<Product>) {
    Object.assign(this, initData);
  }
}
