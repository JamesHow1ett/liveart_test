<template>
  <v-form>
    <v-text-field v-model="tagTitle" label="Title" variant="outlined"></v-text-field>

    <v-select
      v-model="tagColor"
      :items="$options.colors"
      label="Color"
      variant="outlined"
    >
      <template #item="{ props, item: { value } }">
        <v-list-item v-bind="props" :color="value" :base-color="value"></v-list-item>
      </template>

      <template #selection="{ item: { value, title } }">
        <v-chip :color="value">
          <span>{{ title }}</span>
        </v-chip>
      </template>
    </v-select>

    <v-btn color="blue-grey" class="mr-4" :disabled="emptyForm" @click="resetForm">
      Reset form
    </v-btn>
    <v-btn color="success" :disabled="disabled" @click="saveForm">Apply</v-btn>
  </v-form>
</template>

<script lang="ts">
import { computed, ref } from 'vue';

export default {
  name: 'TagsCreateForm',

  emits: ['save-tag'],

  colors: [
    {
      title: 'Default',
      value: '',
    },
    {
      title: 'Orange',
      value: 'orange',
    },
    {
      title: 'Purple',
      value: 'purple',
    },
    {
      title: 'Green',
      value: 'green',
    },
    {
      title: 'Blue',
      value: 'blue',
    },
    {
      title: 'Blue grey',
      value: 'blue-grey',
    },
  ],

  setup(_, ctx) {
    const tagTitle = ref('');
    const tagColor = ref('');

    const emptyForm = computed(() => tagTitle.value === '' && tagColor.value === '');
    const disabled = computed(() => tagTitle.value === '');

    function resetForm() {
      tagTitle.value = '';
      tagColor.value = '';
    }

    function saveForm() {
      ctx.emit('save-tag', {
        title: tagTitle.value,
        color: tagColor.value,
      });
      resetForm();
    }

    return {
      tagTitle,
      tagColor,
      emptyForm,
      disabled,
      resetForm,
      saveForm,
    };
  },
};
</script>
