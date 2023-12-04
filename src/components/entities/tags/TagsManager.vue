<template>
  <v-container>
    <tag-component :items="state.tags" hide-icon no-action />

    <v-card class="mt-6">
      <v-card-title>
        <h2>Create a new Tag</h2>
      </v-card-title>

      <v-card-text>
        <tags-create-form @save-tag="saveTag" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import TagComponent from '../../common/TagComponent.vue';
import TagsCreateForm from './TagsCreateForm.vue';
import store from '../../../store/Store';
import { Tags } from '../../../models/entities/Tags';

const Component = defineComponent({
  name: 'TagsManager',

  components: {
    TagComponent,
    TagsCreateForm,
  },

  props: {},

  setup() {
    const store = useStore();

    const state = reactive({
      tags: computed(() => store.getters['tagsModule/items']),
    });

    function saveTag(tag: Tags) {
      store.dispatch('tagsModule/addItem', tag);
    }

    return {
      store,
      state,
      saveTag,
    };
  },

  async mounted() {
    await store.dispatch('tagsModule/fetchItems');
  },
});

export default Component;
</script>
