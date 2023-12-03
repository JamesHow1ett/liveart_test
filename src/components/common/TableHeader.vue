<template>
  <div class="d-flex">
    <v-col cols="4" class="py-0 px-0">
      <slot name="left">
        <search-bar :store-path="storePath" />
      </slot>
    </v-col>

    <v-col cols="4" class="py-0 px-0">
      <slot name="center"></slot>
    </v-col>

    <v-col cols="4" class="py-0 d-flex justify-end" align-self="center">
      <slot name="right">
        <v-btn depressed small class="mb-2" color="primary" @click="showAddForm()">
          New Item
        </v-btn>
      </slot>
    </v-col>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
// @ts-ignore
import SearchBar from '@/components/utils/SearchBar.vue';

const Component = defineComponent({
  name: 'TableHeader',

  components: {
    SearchBar,
  },

  props: {
    placeholder: {
      type: String,
      default: '',
    },
    storePath: {
      type: String,
      default: '',
    },
  },

  setup() {
    const router = useRouter();
    function showAddForm() {
      router.push(router.currentRoute.value.path + '/new');
    }

    return {
      showAddForm,
    };
  },
});

export default Component;
</script>

<style scoped>
.searchBar {
  max-width: 200px;
}
</style>
