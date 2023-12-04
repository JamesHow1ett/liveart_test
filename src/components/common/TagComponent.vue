<template>
  <h2 v-if="!isTableView">All tags</h2>
  <v-chip
    v-for="tag of items"
    :key="tag.id"
    :size="chipsSize"
    :color="tag.color"
    class="ma-2 hover"
    label
    @click="handleTagClick(tag)"
  >
    <template #prepend>
      <v-icon start icon="mdi-label"></v-icon>
    </template>
    {{ tag.title }}
    <template v-if="!hideIcon" #append>
      <v-icon end :icon="appendTagIcon"></v-icon>
    </template>
  </v-chip>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

const Component = defineComponent({
  name: 'TagComponent',

  props: {
    noAction: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideIcon: {
      type: Boolean,
      required: false,
      default: false,
    },
    size: {
      type: String,
      required: false,
      default: 'large',
    },
    view: {
      type: String,
      required: false,
      default: 'full',
      validator: (value: string) => ['simple', 'full'].includes(value),
    },
    actionType: {
      type: String,
      required: false,
      default: '',
      validator: (value: string) => ['remove', 'add'].includes(value),
    },
    items: {
      type: Array<{ id: string; title: string; color: string }>,
      required: false,
      default: () => [],
    },
  },

  emits: ['tag:remove', 'tag:add'],

  setup(props, ctx) {
    const isTableView = computed(() => props.view === 'simple');
    const chipsSize = computed(() => {
      if (isTableView.value) {
        return 'small';
      }

      return props.size || 'x-large';
    });
    const isRemoveAction = computed(() => props.actionType === 'remove');
    const appendTagIcon = computed(() =>
      isRemoveAction.value ? 'mdi-close' : 'mdi-plus',
    );

    function handleTagClick(tag: any) {
      if (props.noAction) {
        return;
      }

      if (isRemoveAction.value) {
        ctx.emit('tag:remove', tag);
      } else {
        ctx.emit('tag:add', tag);
      }
    }

    return {
      isTableView,
      chipsSize,
      appendTagIcon,
      handleTagClick,
    };
  },
});

export default Component;
</script>

<style scoped>
.hover:hover {
  cursor: pointer;
}
</style>
