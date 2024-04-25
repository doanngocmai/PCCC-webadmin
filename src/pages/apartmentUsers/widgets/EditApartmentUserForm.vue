<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { ApartmentUser } from '../types'
import { validators } from '../../../services/utils'
import { listAllBuilding } from '../../../data/pages/buildings'

console.log(listAllBuilding.data)
const props = defineProps({
  apartment: {
    type: Object as PropType<ApartmentUser | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewContent: ApartmentUser = {
  id: -1,
  address: '',
  name: '',
  floorNumber: '',
  buildingId: 0,
  mapId: 0,
  areaId: 0,
}

const newApartment = ref<ApartmentUser>({ ...defaultNewContent })

const buildingSelectOptions = listAllBuilding.data.map((building) => ({
  text: building.name,
  value: building.id,
}))

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newApartment.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return (
      newApartment.value[key as keyof ApartmentUser] !==
      (props.apartment ?? defaultNewContent)?.[key as keyof ApartmentUser]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.apartment,
  () => {
    if (!props.apartment) {
      return
    }

    newApartment.value = {
      ...props.apartment,
    }
  },
  { immediate: true },
)

const form = useForm('add-apartment-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    console.log(newApartment.value)
    emit('save', newApartment.value)
  }
}
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-apartment-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newApartment.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaInput v-model="newApartment.floorNumber" label="FloorNumber" class="w-full sm:w-1/2" name="floorNumber" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newApartment.address" label="Address" class="w-full" name="address" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect
          v-model="newApartment.buildingId"
          label="Building"
          class="w-full"
          :options="buildingSelectOptions"
          :rules="[validators.required, (v) => newApartment.buildingId !== 0 || 'Please choose Type']"
          name="type"
          value-by="value"
          option-label="text"
        />
      </div>
    </div>
    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>
