import Mapper from './Mapper';
import { EntityType } from '../../store/entityModules/types';
import { CategoryMapper } from '../../models/mappers/CategoryMapper';
import { ProductMapper } from '../../models/mappers/ProductMapper';
import { TagsMapper } from './TagsMapper';

let categoryMapper: CategoryMapper;
let productMapper: ProductMapper;
let tagMapper: TagsMapper;

export function getEntityMapper(entityType: EntityType): Mapper<Object, Object> {
  switch (entityType) {
    case EntityType.CATEGORY:
      if (!categoryMapper) {
        categoryMapper = new CategoryMapper();
      }
      return categoryMapper;
    case EntityType.PRODUCT:
      if (!productMapper) {
        productMapper = new ProductMapper();
      }
      return productMapper;
    case EntityType.TAG:
      if (!tagMapper) {
        tagMapper = new TagsMapper();
      }
      return tagMapper;
    default:
      throw Error(`No matching mapper found for ${entityType}!`);
  }
}
