<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Building, TypeBuilding, TextTypeBuilding } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  building: {
    type: Object as PropType<Building | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewContent: Building = {
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

const newBuilding = ref<Building>({ ...defaultNewContent })

const BuildingSelectOptions: { text: Capitalize<TextTypeBuilding>; value: TypeBuilding }[] = [
  { text: 'Please Choose Type', value: 0 },
  { text: 'Banner', value: 1 },
  { text: 'Footer', value: 2 },
  { text: 'Contact', value: 3 },
]
const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newBuilding.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newBuilding.value[key as keyof Building] !== (props.building ?? defaultNewContent)?.[key as keyof Building]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.building,
  () => {
    if (!props.building) {
      return
    }

    newBuilding.value = {
      ...props.building,
    }
  },
  { immediate: true },
)

const form = useForm('add-building-form')
console.log(form)

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    console.log(newBuilding.value)
    emit('save', newBuilding.value)
  }
}
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-building-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect
          v-model="newBuilding.type"
          label="Type"
          class="w-full"
          :options="BuildingSelectOptions"
          :rules="[validators.required, (v) => newBuilding.type !== 0 || 'Please choose Type']"
          name="type"
          value-by="value"
          option-label="text"
        />
        <VaInput
          v-model="newBuilding.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newBuilding.color" label="Color" class="w-full sm:w-1/2" name="color" />
        <VaInput v-model="newBuilding.icon" label="Icon" class="w-full sm:w-1/2" name="icon" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newBuilding.link" label="Link" class="w-full" name="link" />
      </div>
      <!-- <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaFileUpload
          v-model="newBuilding.image"
          type="single"
          hide-file-list
          class="self-stretch justify-start items-center gap-4 inline-flex"
        >
          <VaButton preset="primary" size="small">Add image</VaButton>
        </VaFileUpload>
      </div> -->
      <div class="flex items-center w-1/2 mt-4">
        <VaCheckbox v-model="newBuilding.isActive" label="IsActive" class="w-full" name="active" />
      </div>
    </div>
    <VaTextarea v-model="newBuilding.description" label="Description" class="w-full" name="description" />

    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>
