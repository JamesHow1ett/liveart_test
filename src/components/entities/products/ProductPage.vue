<template>
  <EntityPage
    entity-type="product"
    :title="title"
    :item="state.entity"
    :loading="state.loading"
    :is-new="isNew()"
    :is-deletable="!isNew()"
  >
    <template #form-content>
      <div>
        <v-row align="start">
          <v-col cols="12">
            <v-text-field
              v-model="state.entity.name"
              label="Name"
              variant="outlined"
              required
              hide-details="auto"
              :rules="rules.name"
              data-test="product-name"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="state.entity.categoryId"
              label="Category ID"
              variant="outlined"
              hide-details="auto"
              :items="listCategory"
              item-title="name"
              item-value="id"
              data-test="product-categoryId"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="state.entity.description"
              label="Description"
              variant="outlined"
              hide-details="auto"
              data-test="product-description"
            />
          </v-col>
          <v-col cols="12">
            <thumbnail-block
              :src="state.entity.medias.thumbnail[0]?.path"
              :product-name="state.entity.name"
              @update:file="handleAttachFile"
            />
          </v-col>
          <v-col cols="12">
            <product-visibility
              v-model:hidden="state.entity.hidden"
              :product-id="state.entity.id ?? ''"
            />
          </v-col>
          <v-col cols="12">
            <h3>Product tags</h3>
            <tag-component
              :items="state.entity.tags"
              action-type="remove"
              view="simple"
              @tag:remove="handleTagRemove"
            />
          </v-col>
          <v-col cols="12">
            <h3>List of availables tags (click to add them to product)</h3>
            <tag-component
              :items="availableProductTags"
              action-type="add"
              view="simple"
              @tag:add="handleTagAdd"
            />
          </v-col>
        </v-row>
      </div>
    </template>
  </EntityPage>
</template>

<script lang="ts">
// @ts-ignore
import EntityPage from '@/components/common/EntityPage.vue';
import { defineComponent, onBeforeMount, reactive, watch, computed, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Product } from '../../../models/entities/Product';
import ThumbnailBlock from '../../common/ThumbnailBlock.vue';
import ProductVisibility from '../../common/ProductVisibilityBlock.vue';
import TagComponent from '../../common/TagComponent.vue';

interface State {
  entity: Product & { removeThumb?: boolean };
  allTags: any[];
  loading: boolean;
}

const Component = defineComponent({
  name: 'ProductPage',

  components: {
    EntityPage,
    ThumbnailBlock,
    ProductVisibility,
    TagComponent,
  },

  props: {
    id: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const store = useStore();
    const router = useRouter();
    const product = new Product({});
    const isNew = () => !props.id;
    let listCategory: Ref<string[]> = ref([]);
    onBeforeMount(async () => {
      if (!isNew()) {
        const res = await store.dispatch(`productsModule/fetchItem`, props.id);
        if (!res) router.back();
      }
      listCategory.value = await store.dispatch(
        'categoriesModule/fetchAllItems',
        undefined,
      );
      await store.dispatch('tagsModule/fetchItems');
    });

    const state = reactive({
      entity: { ...product, removeThumb: false },
      allTags: computed(() => store.getters['tagsModule/items']),
      loading: computed(() => store.getters['productsModule/loading']),
    }) as State;

    const title = computed(() => {
      if (state.loading) return '';
      if (isNew()) return 'New Product';
      const getSelectedItem = store.getters['productsModule/selectedItem'];
      return getSelectedItem.name;
    });
    const availableProductTags = computed(() =>
      state.allTags.filter(
        tag => !state.entity.tags.find(productTag => productTag.id === tag.id),
      ),
    );

    watch(
      () => store.getters['productsModule/selectedItem'],
      (newValue: Product) => {
        state.entity = {
          ...Object.assign(product, newValue),
        };
      },
      { immediate: false, deep: true },
    );

    const rules = {
      name: [(v: string) => !!v || 'Name is required'],
    };

    function handleAttachFile(file: File | null) {
      if (file === null) {
        state.entity = {
          ...Object.assign({}, state.entity, {
            medias: {
              ...state.entity.medias,
              thumbnail: [],
            },
            removeThumb: true,
          }),
        };
      } else {
        state.entity = {
          ...Object.assign({}, state.entity, {
            file,
            removeThumb: false,
          }),
        };
      }
    }

    function handleTagRemove(tag: any) {
      state.entity = {
        ...Object.assign({}, state.entity, {
          tags: state.entity.tags.filter(item => item.id !== tag.id),
        }),
      };
    }
    async function handleTagAdd(tag: any) {
      state.entity = {
        ...Object.assign({}, state.entity, {
          tags: [...state.entity.tags, tag],
        }),
      };
    }

    return {
      state,
      title,
      rules,
      listCategory,
      availableProductTags,
      isNew,
      handleAttachFile,
      handleTagRemove,
      handleTagAdd,
    };
  },
});
export default Component;
</script>

<style scoped></style>
