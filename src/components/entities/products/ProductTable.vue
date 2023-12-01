<template>
  <entity-table :entity-type="entityType" :headers="state.headers">
    <template #thumbnail="{ thumbnail, productName }">
      <thumbnail-view
        :src="thumbnail[0]?.path ?? ''"
        :product-name="productName"
        :size="50"
      />
    </template>
  </entity-table>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { EntityType } from '../../../store/entityModules/types';
import EntityTable from '../../common/EntityTable.vue';
import ThumbnailView from '../../common/ThumbnailView.vue';

const Component = defineComponent({
  name: 'ProductTable',

  components: {
    EntityTable,
    ThumbnailView,
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
      ],
    });

    return {
      entityType,
      state,
    };
  },
});
export default Component;
</script>

<style lang="scss" scoped></style>
