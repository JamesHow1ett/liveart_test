import { ProductDTO } from '../../api/dto/ProductDTO';
import { ITableHeader } from '../../models/filters/Filters';
import { SearchQueryFilters } from '../../models/filters/SearchQueryFilters';
import { CrudModule } from '../entityModules/CrudModule';
import { Product } from '../../models/entities/Product';
import { EntityType } from '../entityModules/types';
import { getEntityApiClient } from '../../api/utils/GetClient';
import { AlertColor, AlertMessageData, dispatchAlert } from '../../utils/alerts';
import { getBulkActions } from './utils/bulkActionUtils';
import Mapper from '../../models/mappers/Mapper';
import { getEntityMapper } from '../../models/mappers/utils';

class ProductModule extends CrudModule<Product, ProductDTO> {
  constructor() {
    super();
    this.state = {
      ...this.state,

      entityType: EntityType.PRODUCT,
      queryFilters: new SearchQueryFilters({}),
    };

    this.getters = {
      ...this.getters,

      getItem: state => (id: string) => {
        const item = state.items.find((i: Product) => i.id === id);
        return item || null;
      },

      getSearchValue(state): string | null {
        const filter = state.queryFilters as SearchQueryFilters;
        if (!filter.searchFilter) return null;
        return filter.searchFilter.value || null;
      },

      getSearchHeaders(state): ITableHeader[] {
        const filter = state.queryFilters as SearchQueryFilters;
        if (!filter.searchFilter) return [];
        return filter.searchFilter.headers;
      },
    };

    this.actions = {
      ...this.actions,

      async addItem(
        { state, commit, dispatch },
        { item, fields }: { item: Product; fields: string[] },
      ) {
        commit('setLoading', true);

        const alertData: AlertMessageData = {
          entityName: state.entityType,
          action: 'add',
          single: true,
        };

        try {
          const apiClient = getEntityApiClient(state.entityType);
          const mapper = <Mapper<Product, ProductDTO>>getEntityMapper(state.entityType);
          const mappedItem = mapper.mapToFormDataDTO(item, fields);

          const response = await apiClient.addItem(mappedItem);
          if (!response) return null;

          const newItem = mapper.mapFromDTO(response);

          commit('addItem', newItem);
          commit('setSelectedItem', newItem);

          dispatchAlert(AlertColor.SUCCESS, alertData, dispatch);
        } catch (err) {
          console.error(err);
          dispatchAlert(AlertColor.ERROR, alertData, dispatch);
        } finally {
          commit('setLoading', false);
        }
      },

      async updateItem(
        { state, commit, dispatch },
        { item, fields }: { item: Product; fields: string[] },
      ) {
        commit('setLoading', true);

        const alertData: AlertMessageData = {
          entityName: state.entityType,
          action: 'save',
          id: item.id,
        };

        try {
          const apiClient = getEntityApiClient(state.entityType);
          const mapper = <Mapper<Product, ProductDTO>>getEntityMapper(state.entityType);
          const mappedItem = mapper.mapToFormDataDTO(item, fields);

          const response = await apiClient.updateItem(item.id, mappedItem);
          if (!response) return null;

          const newItem = mapper.mapFromDTO(response);

          commit('updateItem', newItem);
          commit('setSelectedItem', newItem);

          dispatchAlert(AlertColor.SUCCESS, alertData, dispatch);
        } catch (err) {
          console.error(err);
          dispatchAlert(AlertColor.ERROR, alertData, dispatch);
        } finally {
          commit('setLoading', false);
        }
      },

      async patchItem(
        { state, commit, dispatch, getters },
        { productId, product }: { productId: string; product: Partial<Product> },
      ) {
        commit('setLoading', true);

        const alertData: AlertMessageData = {
          entityName: state.entityType,
          action: 'update',
          id: productId,
        };

        try {
          const apiClient = getEntityApiClient(state.entityType);

          await apiClient.patchItem(productId, product);

          const updatedProduct = getters.getItemById(productId);

          commit('updateItem', Object.assign(updatedProduct, product));

          dispatchAlert(AlertColor.SUCCESS, alertData, dispatch);
        } catch (err) {
          console.error(err);
          dispatchAlert(AlertColor.ERROR, alertData, dispatch);
        } finally {
          commit('setLoading', false);
        }
      },

      async patchAll(
        { state, commit, dispatch },
        { productsId, product }: { productsId: string[]; product: Partial<Product> },
      ) {
        commit('setLoading', true);

        const alertData: AlertMessageData = {
          entityName: state.entityType,
          action: 'update',
          id: productsId,
        };

        try {
          const apiClient = getEntityApiClient(state.entityType);

          await apiClient.patchAll(productsId, product);
          await dispatch('fetchItems');

          dispatchAlert(AlertColor.SUCCESS, alertData, dispatch);
        } catch (err) {
          console.error(err);
          dispatchAlert(AlertColor.ERROR, alertData, dispatch);
        } finally {
          commit('setLoading', false);
        }
      },

      async bulk(
        { state, dispatch },
        { action, productsToApply }: { action: string; productsToApply: any[] },
      ): Promise<void> {
        const dispatchedAction = getBulkActions(action, productsToApply, dispatch);

        try {
          await Promise.all(dispatchedAction.map(actionFn => actionFn()));
        } catch (err) {
          console.error(err);
          dispatchAlert(
            AlertColor.ERROR,
            {
              entityName: state.entityType,
              action,
              id: productsToApply.join(', '),
            },
            dispatch,
          );
        }
      },

      setSearchValue({ getters, commit }, value: string | null) {
        commit('setQueryFilters', {
          searchFilter: {
            value,
            headers: getters.getSearchHeaders,
          },
          page: 1,
        });
      },

      setSearchHeaders({ commit }, value: ITableHeader[]) {
        commit('setQueryFilters', {
          searchFilter: {
            headers: value,
          },
        });
      },
    };
  }
}

// Ask question about this line: why it wasnt written as single line?
const productsModule = new ProductModule();
export default productsModule;
