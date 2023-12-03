import { ProductDTO } from '../../api/dto/ProductDTO';
import { ITableHeader } from '../../models/filters/Filters';
import { SearchQueryFilters } from '../../models/filters/SearchQueryFilters';
import { CrudModule } from '../entityModules/CrudModule';
import { Product } from '../../models/entities/Product';
import { EntityType } from '../entityModules/types';
import { getEntityApiClient } from '../../api/utils/GetClient';
import { AlertColor, AlertMessageData, dispatchAlert } from '../../utils/alerts';

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

      async patchItem(
        { state, commit, dispatch },
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

          dispatchAlert(AlertColor.SUCCESS, alertData, dispatch);
        } catch (err) {
          console.error(err);
          dispatchAlert(AlertColor.ERROR, alertData, dispatch);
        } finally {
          commit('setLoading', false);
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

const productsModule = new ProductModule();
export default productsModule;
