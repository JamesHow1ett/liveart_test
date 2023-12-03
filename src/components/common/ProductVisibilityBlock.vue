<template>
  <v-switch
    v-if="isFormView"
    :model-value="hidden"
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
          @click="handleChangeStatus(!hidden)"
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
    productId: {
      type: String,
      required: true,
    },
    hidden: {
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
    const visibilityStatusText = computed(() =>
      props.hidden ? 'This product is hidden' : 'This product is visible',
    );
    const visibilityStatusColor = computed(() =>
      props.hidden ? 'blue-grey-lighten-3' : 'success',
    );
    const visibilityStatusTableIcon = computed(() =>
      props.hidden ? 'mdi-eye-off-outline' : 'mdi-eye-outline',
    );
    const isFormView = computed(() => props.view === 'form');

    function emitValue(hidden: boolean) {
      if (isFormView.value) {
        ctx.emit('update:isHidden', hidden);
      } else {
        ctx.emit('change:visibility', { id: props.productId, hidden });
      }
    }

    function handleChangeStatus(value: boolean) {
      emitValue(value);
    }

    return {
      visibilityStatusText,
      visibilityStatusColor,
      visibilityStatusTableIcon,
      isFormView,
      handleChangeStatus,
    };
  },
});

export default Component;
</script>
