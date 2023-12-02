<template>
  <v-switch
    v-if="isFormView"
    :model-value="isHiddenRaw"
    :label="visibilityStatusText"
    :color="visibilityStatusColor"
    :false-value="true"
    :true-value="false"
    hide-details
    @update:model-value="handleChangeStatus"
  ></v-switch>
  <div v-else>
    <v-tooltip :text="visibilityStatusText">
      <template #activator="{ props }">
        <v-icon
          v-bind="props"
          :color="visibilityStatusColor"
          @click="handleChangeStatus(!isHiddenRaw)"
        >
          {{ visibilityStatusTableIcon }}
        </v-icon>
      </template>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

const Component = defineComponent({
  name: 'ProductVisibilityBlock',

  props: {
    isHidden: {
      type: Boolean,
      required: false,
      default: true,
    },
    view: {
      type: String,
      required: false,
      default: 'form',
      validator: (value: string): boolean => {
        const viewTypes = ['form', 'table'];

        return viewTypes.includes(value);
      },
    },
  },

  emits: ['change:visibility', 'update:isHidden'],

  setup(props, ctx) {
    const isHiddenRaw = ref(props.isHidden);

    const visibilityStatusText = computed(() =>
      isHiddenRaw.value ? 'This product is hidden' : 'This product is visible',
    );
    const visibilityStatusColor = computed(() =>
      isHiddenRaw.value ? 'blue-grey-lighten-3' : 'success',
    );
    const visibilityStatusTableIcon = computed(() =>
      isHiddenRaw.value ? 'mdi-eye-off-outline' : 'mdi-eye-outline',
    );
    const isFormView = computed(() => props.view === 'form');

    function emitValue(value: boolean) {
      ctx.emit('change:visibility', value);
      ctx.emit('update:isHidden', value);
    }

    function handleChangeStatus(value: boolean) {
      isHiddenRaw.value = value;
      emitValue(isHiddenRaw.value);
    }

    return {
      visibilityStatusText,
      visibilityStatusColor,
      visibilityStatusTableIcon,
      isFormView,
      isHiddenRaw,
      handleChangeStatus,
    };
  },
});

export default Component;
</script>
