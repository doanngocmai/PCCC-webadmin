<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { New, TypeNew, TextTypeNew } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  item: {
    type: Object as PropType<New | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewContent: New = {
  id: -1,
  title: '',
  content: '',
  image: '',
  type: 0,
  isActive: true,
}

const image = ref<File>()

const makeAvatarBlobUrl = (image: File) => {
  return URL.createObjectURL(image)
}

watch(image, (newImage) => {
  newNew.value.image = newImage ? makeAvatarBlobUrl(newImage) : ''
})

const newNew = ref<New>({ ...defaultNewContent })

const contentSelectOptions: { text: Capitalize<TextTypeNew>; value: TypeNew }[] = [
  { text: 'Please Choose Type', value: 0 },
  { text: 'Banner', value: 1 },
  { text: 'Footer', value: 2 },
  { text: 'Contact', value: 3 },
]
const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newNew.value).some((key) => {
    if (key === 'image') {
      return false
    }

    return newNew.value[key as keyof New] !== (props.item ?? defaultNewContent)?.[key as keyof New]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.item,
  () => {
    if (!props.item) {
      return
    }

    newNew.value = {
      ...props.item,
      image: props.item.image || '',
    }
  },
  { immediate: true },
)
const form = useForm('add-new-form')
console.log(form)

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    console.log(newNew.value)
    emit('save', newNew.value)
  }
}
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-new-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newNew.title"
          label="title"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="title"
        />
        <VaSelect
          v-model="newNew.type"
          label="Type"
          class="w-full"
          :options="contentSelectOptions"
          :rules="[validators.required, (v) => newNew.type !== 0 || 'Please choose Type']"
          name="type"
          value-by="value"
          option-label="text"
        />
      </div>
      <div class="w-full">
        <VaFileUpload
          v-model="image"
          type="single"
          hide-file-list
          class="self-stretch justify-start items-center gap-4 inline-flex"
        >
          <VaButton preset="primary" size="small">Add image</VaButton>
          <VaButton
            v-if="image"
            preset="primary"
            color="danger"
            size="small"
            icon="delete"
            class="z-10"
            @click.stop="image = undefined"
          />
        </VaFileUpload>
        <VaImage :src="newNew.image" fit="cover" :class="['flex', 'w-full', 'max-h-32', { 'h-0': !image }]" />
      </div>
      <VaTextarea v-model="newNew.content" label="Description" class="w-full" name="description" />
      <div class="flex items-center w-1/2 mt-4">
        <VaCheckbox v-model="newNew.isActive" label="IsActive" class="w-full" name="active" />
      </div>
    </div>
    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>
<style lang="scss" scoped>
.va-file-upload-gallery-item {
  min-width: 25rem !important;
}
</style>
