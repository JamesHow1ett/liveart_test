<template>
  <v-card v-if="loading" data-test="dialog-preloader">
    <v-skeleton-loader type="article" />
    <v-skeleton-loader type="actions" />
  </v-card>
  <v-card v-else data-test="dialog-card">
    <!-- Dialog title -->
    <v-card-title class="headline pl-5 pr-3 d-flex align-center" data-test="dialog-title">
      <v-btn
        color="gray"
        icon
        variant="text"
        size="44px"
        :disabled="loading"
        data-test="dialog-btn-cancel"
        @click="close()"
      >
        <v-icon :size="28" color="grey-darken-1" icon="mdi-arrow-left-circle-outline" />
      </v-btn>
      <span>{{ title }}</span>
    </v-card-title>

    <v-divider />

    <v-form v-model="valid">
      <v-card-text>
        <v-container fluid class="pa-0">
          <!-- Form content (input fields, etc) goes here -->
          <slot name="form-content" />
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions tile class="pa-3">
        <!-- DELETE -->
        <!-- show tooltip is there are delete warning messages -->
        <v-tooltip v-if="isDeletable && deleteRules && deleteRules.length > 0" right>
          <template #activator="{ props }">
            <span v-bind="props">
              <v-btn
                color="error"
                variant="text"
                disabled
                data-test="dialog-btn-del-by-tooltip"
              >
                Delete
              </v-btn>
            </span>
          </template>
          <div v-for="(rule, i) in deleteRules" :key="i">
            {{ rule }}
          </div>
        </v-tooltip>
        <!-- if no warning messages - ask for confirmation before delete -->
        <confirmation-dialog
          v-else-if="isDeletable"
          :confirm-message="`Are you sure you want to delete ${title}?`"
          @confirmed="deleteItem($event)"
        >
          <template #activator-btn="{ on }">
            <v-btn
              color="error"
              variant="text"
              :disabled="loading"
              v-bind="on"
              data-test="dialog-btn-del-by-conf"
            >
              Delete
            </v-btn>
          </template>
        </confirmation-dialog>

        <v-spacer />

        <!-- CANCEL -->
        <v-btn
          color="gray"
          variant="text"
          :disabled="loading"
          data-test="dialog-btn-cancel"
          @click="close()"
        >
          Cancel
        </v-btn>

        <!-- SAVE / CREATE -->
        <v-btn
          color="success"
          :disabled="!valid || loading"
          variant="text"
          data-test="dialog-btn-confirm"
          @click="confirm()"
        >
          {{ confirmButtonText }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { EntityType } from '../../store/entityModules/types';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { PropType } from 'vue';
import { getEntityStorePath } from '../../store/entityModules/utils';
import { getNounPluralForm } from '../../utils/formatting';
import Confirmation from '../utils/Confirmation.vue';
import { VSkeletonLoader } from 'vuetify/labs/components';

const Component = defineComponent({
  name: 'EntityDialog',

  components: {
    ConfirmationDialog: Confirmation,
    VSkeletonLoader,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
    entityType: {
      type: String as PropType<EntityType>,
      default: '',
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    isNew: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDeletable: {
      type: Boolean,
      required: false,
      default: false,
    },
    deleteRules: {
      type: Array,
      default: () => [],
    },
  },

  setup(props) {
    const productCreateFormDataFields = ['categoryId', 'description', 'name', 'file'];
    const productUpdateFormDataFields = [
      ...productCreateFormDataFields,
      'id',
      'removeThumb',
    ];

    const dialogVisible = true;
    const store = useStore();
    const router = useRouter();
    const valid = ref(true);

    const storePath = computed(() => getEntityStorePath(props.entityType));
    const confirmActionType = computed(() =>
      props.isNew ? `${storePath.value}/addItem` : `${storePath.value}/updateItem`,
    );
    const confirmButtonText = computed(() => (props.isNew ? 'Create' : 'Save'));
    const formDataFieldList = computed(() =>
      props.isNew ? productCreateFormDataFields : productUpdateFormDataFields,
    );

    function confirm() {
      store.dispatch(confirmActionType.value, {
        item: props.item,
        fields: formDataFieldList.value,
      });
      close();
    }

    function deleteItem(confirmed: boolean) {
      if (!confirmed) return;

      if (props.item) {
        const id = props.item.id;
        store.dispatch(`${storePath.value}/deleteItem`, id);
        close();
      }
    }

    function close() {
      const entityPath = getNounPluralForm(props.entityType);
      router.push(`/${entityPath}`);
    }

    return {
      valid,
      dialogVisible,
      confirmButtonText,
      deleteItem,
      close,
      confirm,
    };
  },
});

export default Component;
</script>

<style scoped>
.back_btn {
  padding: 0;
  width: 44px;
  height: 44px;
}
</style>
