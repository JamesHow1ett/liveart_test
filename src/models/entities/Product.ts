import Entity from './Entity';
import { TagsDTO } from '../../api/dto/TagsDTO';

export interface ProductMedia {
  filename: string;
  originalname: string;
  size: number;
  path: string;
  createAt: number;
  updateAt: number;
}

export class Product implements Entity {
  public id?: string;
  public name = '';
  public categoryId = '';
  public description = '';
  public medias: {
    images: Array<ProductMedia>;
    thumbnail: Array<ProductMedia>;
  } = {
    images: [],
    thumbnail: [],
  };
  public hidden = false;
  public tags: TagsDTO[] = [];

  constructor(initData: Partial<Product>) {
    Object.assign(this, initData);
  }
}
