import { EntityType } from './types';

export function getEntityStorePath(entityType: EntityType): string {
  const storeModules = {
    [EntityType.PRODUCT]: 'productsModule',
    [EntityType.CATEGORY]: 'categoriesModule',
    [EntityType.TAG]: 'tagsModule',
  };

  const storePath = storeModules[entityType];

  if (!storePath) {
    console.error('No entity module matches provided entity type');
    return '';
  }

  return storePath;
}
