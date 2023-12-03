const bulkActions = {
  DELETE_PRODUCT: 'delete',
  HIDE_PRODUCT: 'hide',
  SHOW_PRODUCT: 'show',
};

const actionHandler = {
  hide: (productsId: string[], dispatch: Function) => () => {
    dispatch('patchAll', { productsId, product: { hidden: true } });
  },
  show: (productsId: string[], dispatch: Function) => () => {
    dispatch('patchAll', { productsId, product: { hidden: false } });
  },
  delete: (productId: string, dispatch: Function) => () => {
    dispatch('deleteItem', productId);
  },
};

export function getBulkActions(
  actionType: string,
  productsId: string[],
  dispatchFn: Function,
): Array<Function> {
  if (actionType === bulkActions.DELETE_PRODUCT) {
    return productsId.map(id => actionHandler.delete(id, dispatchFn));
  }

  return [actionHandler[actionType](productsId, dispatchFn)];
}
