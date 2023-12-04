import { ICrudEndpoint } from '../../api/common/CrudEndpoint';
import { CategoryCRUD } from '../endpoints/CategoryCRUD';
import { ProductCRUD } from '../endpoints/ProductCRUD';
import { EntityType } from '../../store/entityModules/types';
import { TagsCRUD } from '../endpoints/TagsCRUD';

let categoryClient: CategoryCRUD;
let productClient: ProductCRUD;
let tagsClient: TagsCRUD;

export function getEntityApiClient(entityType: EntityType): ICrudEndpoint<any> {
  switch (entityType) {
    case EntityType.CATEGORY:
      if (!categoryClient) {
        categoryClient = new CategoryCRUD();
      }
      return categoryClient;
    case EntityType.PRODUCT:
      if (!productClient) {
        productClient = new ProductCRUD();
      }
      return productClient;
    case EntityType.TAG:
      if (!tagsClient) {
        tagsClient = new TagsCRUD();
      }
      return tagsClient;
    default:
      throw Error(`No matching API client found for ${entityType}!`);
  }
}
