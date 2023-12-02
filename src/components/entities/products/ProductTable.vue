<template>
  <entity-table :entity-type="entityType" :headers="state.headers">
    <template #thumbnail="{ thumbnail, productName }">
      <thumbnail-view
        :src="thumbnail[0]?.path ?? ''"
        :product-name="productName"
        :size="50"
      />
    </template>
    <template #status="{ item }">
      <product-visibility
        :is-hidden="item.hidden"
        view="table"
        @change:visibility="handleChangeProductVisibility"
      />
    </template>
  </entity-table>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { EntityType } from '../../../store/entityModules/types';
import EntityTable from '../../common/EntityTable.vue';
import ThumbnailView from '../../common/ThumbnailView.vue';
import ProductVisibility from '../../common/ProductVisibilityBlock.vue';

const Component = defineComponent({
  name: 'ProductTable',

  components: {
    EntityTable,
    ThumbnailView,
    ProductVisibility,
  },

  setup() {
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

    function handleChangeProductVisibility(isHidden: boolean): void {
      console.log('isHidden: ', isHidden);
    }

    return {
      entityType,
      state,
      handleChangeProductVisibility,
    };
  },
});
export default Component;
</script>

<style lang="scss" scoped></style>
