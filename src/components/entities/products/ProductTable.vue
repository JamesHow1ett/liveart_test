<template>
  <entity-table :entity-type="entityType" :headers="state.headers">
    <template #top-center="{ selected }">
      <bulk-actions
        :disabled="selected?.length === 0"
        @apply:action="handleApplyBulkAction($event, selected)"
      />
    </template>
    <template #thumbnail="{ thumbnail, productName }">
      <thumbnail-view
        :src="thumbnail[0]?.path ?? ''"
        :product-name="productName"
        :size="50"
      />
    </template>
    <template #status="{ item }">
      <product-visibility
        :product-id="item.id"
        :hidden="item.hidden"
        view="table"
        @change:visibility="handleChangeProductVisibility"
      />
    </template>
  </entity-table>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from 'vuex';
import { EntityType } from '../../../store/entityModules/types';
import EntityTable from '../../common/EntityTable.vue';
import ThumbnailView from '../../common/ThumbnailView.vue';
import ProductVisibility from '../../common/ProductVisibilityBlock.vue';
import BulkActions from '../../utils/BulkActions.vue';

const Component = defineComponent({
  name: 'ProductTable',

  components: {
    EntityTable,
    ThumbnailView,
    ProductVisibility,
    BulkActions,
  },

  setup() {
    const store = useStore();
    const entityType = EntityType.PRODUCT;

    const state = reactive({
      headers: [
        {
          title: 'Thumb',
          key: 'previewImage',
          sortable: false,
          align: 'center',
          width: 50,
          maxWidth: 100,
        },
        { title: 'Name', key: 'name', sortable: true, searchable: true },
        { title: 'Category ID', key: 'categoryId', sortable: true },
        { title: 'Description', key: 'description', sortable: false },
        { title: 'Details', key: 'actions', sortable: false },
        { title: 'Status', key: 'status', sortable: false, editable: true },
      ],
    });

    async function handleChangeProductVisibility({
      id,
      hidden,
    }: {
      hidden: boolean;
      id: string;
    }): Promise<void> {
      await store.dispatch('productsModule/patchItem', {
        productId: id,
        product: { hidden },
      });
    }

    function handleApplyBulkAction(action: string, productsToApply: any[]): void {
      store.dispatch('productsModule/bulk', { action, productsToApply });
    }

    return {
      entityType,
      state,
      handleChangeProductVisibility,
      handleApplyBulkAction,
    };
  },
});
export default Component;
</script>

<style lang="scss" scoped></style>
