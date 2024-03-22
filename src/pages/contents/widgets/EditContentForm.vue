<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Content, TypeContent, TextTypeContent } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  content: {
    type: Object as PropType<Content | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewContent: Content = {
  id: -1,
  name: '',
  description: '',
  color: '',
  link: '',
  image: '',
  icon: '',
  type: 0,
  isActive: true,
}

const newContent = ref<Content>({ ...defaultNewContent })

const contentSelectOptions: { text: Capitalize<TextTypeContent>; value: TypeContent }[] = [
  { text: 'Please Choose Type', value: 0 },
  { text: 'Banner', value: 1 },
  { text: 'Footer', value: 2 },
  { text: 'Contact', value: 3 },
]
const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newContent.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newContent.value[key as keyof Content] !== (props.content ?? defaultNewContent)?.[key as keyof Content]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.content,
  () => {
    if (!props.content) {
      return
    }

    newContent.value = {
      ...props.content,
    }
  },
  { immediate: true },
)

const form = useForm('add-content-form')
console.log(form)

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    console.log(newContent.value)
    emit('save', newContent.value)
  }
}
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-content-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect
          v-model="newContent.type"
          label="Type"
          class="w-full"
          :options="contentSelectOptions"
          :rules="[validators.required, (v) => newContent.type !== 0 || 'Please choose Type']"
          name="type"
          value-by="value"
          option-label="text"
        />
        <VaInput
          v-model="newContent.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newContent.color" label="Color" class="w-full sm:w-1/2" name="color" />
        <VaInput v-model="newContent.icon" label="Icon" class="w-full sm:w-1/2" name="icon" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newContent.link" label="Link" class="w-full" name="link" />
      </div>
      <!-- <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaFileUpload
          v-model="newContent.image"
          type="single"
          hide-file-list
          class="self-stretch justify-start items-center gap-4 inline-flex"
        >
          <VaButton preset="primary" size="small">Add image</VaButton>
          <VaButton
            v-if="avatar"
            preset="primary"
            color="danger"
            size="small"
            icon="delete" 
            @click.stop="avatar = undefined"
          />
        </VaFileUpload>
      </div> -->
      <div class="flex items-center w-1/2 mt-4">
        <VaCheckbox v-model="newContent.isActive" label="IsActive" class="w-full" name="active" />
      </div>
    </div>
    <VaTextarea v-model="newContent.description" label="Description" class="w-full" name="description" />

    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>
