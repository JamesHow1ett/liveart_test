<template>
  <v-row>
    <v-col cols="4">
      <v-card>
        <template #title>
          <span class="text-subtitle-1"> Product thumbnail </span>
        </template>

        <template #default>
          <div class="px-4">
            <thumbnail-view :src="rawSrc" :product-name="productName" />
            <v-alert
              v-if="hasValidationErrors"
              :text="validationErrorsText"
              icon="mdi-information"
              type="error"
              class="mt-2"
            ></v-alert>
          </div>
          <v-file-input
            v-show="false"
            ref="uploadFileInputRef"
            v-model="uploadedThumbnailFile"
            :rules="thumbnailRules"
          ></v-file-input>
        </template>

        <template #actions>
          <v-btn size="small" @click="changeThumbnail">
            {{ uploadFileButtonText }}
          </v-btn>
          <v-btn
            :disabled="hasNoThumbnail"
            size="small"
            color="error"
            @click="removeThumbnail"
          >
            Remove
          </v-btn>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { supportedFileSize, supportedMedias } from '../../utils/validators';
import { getBaseUrl } from '../../api/common/Axios';
import ThumbnailView from './ThumbnailView.vue';

const Component = defineComponent({
  name: 'ThumbnailBlock',

  components: {
    ThumbnailView,
  },

  props: {
    src: {
      type: String,
      required: false,
      default: '',
    },
    productName: {
      type: String,
      required: false,
      default: '',
    },
  },

  emits: ['update:file'],

  setup(props, ctx) {
    const uploadedThumbnailUrl = ref('');
    const uploadedThumbnailFile = ref<Array<File> | null>(null);
    const isEditMode = ref(!(!!uploadedThumbnailUrl.value || !!props.src));
    const validationErrors = ref<Array<string>>([]);
    const uploadFileInputRef = ref();

    const rawSrc = computed(() => {
      if (uploadedThumbnailUrl.value) {
        return uploadedThumbnailUrl.value;
      }

      return props.src !== '' ? `${getBaseUrl()}${props.src.slice(1)}` : props.src;
    });
    const hasNoThumbnail = computed(() => !props.src && !uploadedThumbnailUrl.value);
    const uploadFileButtonText = computed(() =>
      hasNoThumbnail.value ? 'Upload' : 'Change',
    );
    const hasValidationErrors = computed(() => !!validationErrors.value.length);
    const validationErrorsText = computed(() => validationErrors.value.join(', '));
    const isPreviewMode = computed(
      () => !isEditMode.value && (!!uploadedThumbnailUrl.value || !!props.src),
    );
    const thumbnailRules = computed(() => {
      if (uploadedThumbnailFile.value === null || !uploadedThumbnailFile.value.length) {
        return [];
      }

      return [supportedMedias(), supportedFileSize()];
    });

    watch(uploadedThumbnailFile, value => {
      if (!value || !value.length) {
        uploadedThumbnailUrl.value = '';
        return;
      }
      const fileReader = new FileReader();

      fileReader.onload = e => {
        uploadedThumbnailUrl.value = (e.target?.result as string) ?? '';
        isEditMode.value = false;
      };

      validationErrors.value = thumbnailRules.value
        .map(validator => validator(value))
        .filter(value => typeof value === 'string') as string[];

      fileReader.readAsDataURL(value[0]);
    });

    watch(
      () => uploadedThumbnailFile.value,
      files => {
        if (files?.length) {
          ctx.emit('update:file', files[0]);
        }
      },
    );

    function removeThumbnail() {
      uploadedThumbnailUrl.value = '';
      uploadedThumbnailFile.value = null;
      isEditMode.value = true;
      ctx.emit('update:file', null);
    }

    function changeThumbnail() {
      isEditMode.value = true;
      uploadFileInputRef.value.click();
    }

    return {
      uploadedThumbnailFile,
      thumbnailRules,
      isPreviewMode,
      rawSrc,
      hasValidationErrors,
      validationErrorsText,
      uploadFileInputRef,
      uploadFileButtonText,
      hasNoThumbnail,
      removeThumbnail,
      changeThumbnail,
    };
  },
});

export default Component;
</script>
