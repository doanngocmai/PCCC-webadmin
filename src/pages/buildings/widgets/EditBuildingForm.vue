<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Building } from '../types'
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
  address: '',
  name: '',
  floorCount: 0,
  image: '',
  isActive: true,
  note: '',
}

const newBuilding = ref<Building>({ ...defaultNewContent })

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
        <VaInput
          v-model="newBuilding.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaInput v-model="newBuilding.floorCount" label="FloorCount" class="w-full sm:w-1/2" name="floorCount" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newBuilding.address" label="Address" class="w-full sm:w-1/2" name="address" />
      </div>
      <div class="flex items-center w-1/2 mt-4">
        <VaCheckbox v-model="newBuilding.isActive" label="IsActive" class="w-full" name="active" />
      </div>
    </div>
    <VaTextarea v-model="newBuilding.note" label="Note" class="w-full" name="note" />
    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>
