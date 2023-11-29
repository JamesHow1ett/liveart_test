<template>
  <v-img v-if="hasSrc" :height="size" :width="size" :src="parsedSrc">
    <template #error>
      <v-avatar color="primary" class="my-1">
        <span class="text-h5">{{ productNameInitials }}</span>
      </v-avatar>
    </template>
  </v-img>
  <v-avatar v-else :size="size" color="primary" class="my-1">
    <span class="text-h5">{{ productNameInitials }}</span>
  </v-avatar>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { getBaseUrl } from '../../api/common/Axios';

const Component = defineComponent({
  name: 'ThumbnailView',

  props: {
    size: {
      type: [String, Number],
      required: false,
      default: 100,
    },
    src: {
      type: String,
      required: false,
      default: '',
      validator: (value: string) => value.startsWith('/') || value.startsWith('data'),
    },
    productName: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props, ctx) {
    const parsedSrc = computed(() => {
      if (props.src.startsWith('/')) {
        return `${getBaseUrl()}${props.src.slice(1)}`;
      }

      return props.src;
    });
    const hasSrc = computed(() => props.src !== '');
    const productNameInitials = computed(() => props.productName.slice(0, 2));

    return {
      parsedSrc,
      productNameInitials,
      hasSrc,
    };
  },
});

export default Component;
</script>
