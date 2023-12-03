<template>
  <div class="d-flex aling-items-center pt-4">
    <v-col cols="7">
      <v-select
        v-model="selectedAction"
        :items="actionsList"
        :disabled="disabled"
        label="Bulk Actions"
        density="compact"
        variant="outlined"
        hide-details
      ></v-select>
    </v-col>
    <v-col cols="5">
      <v-btn :disabled="disabledApplying" @click="handleApplyAction">Apply</v-btn>
    </v-col>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

const Component = defineComponent({
  name: 'BulkActions',

  props: {
    actions: {
      type: Array<string | { title: string; value: string }>,
      required: false,
      default: () => [
        {
          value: 'hide',
          title: 'Make products hidden',
        },
        {
          value: 'show',
          title: 'Make products visible',
        },
        {
          value: 'delete',
          title: 'Delete products',
        },
      ],
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: ['apply:action'],

  setup(props, ctx) {
    const noneAction = { value: '', title: 'None' };

    const selectedAction = ref('');

    const actionsList = computed(() => [noneAction, ...props.actions]);
    const disabledApplying = computed(
      () => props.disabled || selectedAction.value === '',
    );

    function handleApplyAction(): void {
      ctx.emit('apply:action', selectedAction.value);
      selectedAction.value = '';
    }

    return {
      actionsList,
      selectedAction,
      disabledApplying,
      handleApplyAction,
    };
  },
});

export default Component;
</script>

<style scoped>
.aling-items-center {
  align-items: center;
}
</style>
