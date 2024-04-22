<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { UpgradeAcc, TypeUpgradeAcc, TextTypeUpgradeAcc } from '../types'
import { validators } from '../../../services/utils'
import { CURRENCIES, CURRENCIES_ICONS } from '../../accounts/typeAccounts'

const props = defineProps({
  upgrade: {
    type: Object as PropType<UpgradeAcc | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewContent: UpgradeAcc = {
  id: -1,
  name: '',
  price: 0,
  description: '',
  type: 0,
  startTime: new Date(),
  endTime: new Date(),
  isActive: true,
}

const newUpgradeAcc = ref<UpgradeAcc>({ ...defaultNewContent })

const contentSelectOptions: { text: Capitalize<TextTypeUpgradeAcc>; value: TypeUpgradeAcc }[] = [
  { text: 'Please Choose Type', value: 0 },
  { text: 'Banner', value: 1 },
  { text: 'Footer', value: 2 },
  { text: 'Contact', value: 3 },
]
const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUpgradeAcc.value).some((key) => {
    if (key === 'image') {
      return false
    }

    return (
      newUpgradeAcc.value[key as keyof UpgradeAcc] !== (props.upgrade ?? defaultNewContent)?.[key as keyof UpgradeAcc]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.upgrade,
  () => {
    if (!props.upgrade) {
      return
    }

    newUpgradeAcc.value = {
      ...props.upgrade,
    }
  },
  { immediate: true },
)
const form = useForm('add-new-form')
console.log(form)

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    console.log(newUpgradeAcc.value)
    emit('save', newUpgradeAcc.value)
  }
}
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-new-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUpgradeAcc.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaSelect
          v-model="newUpgradeAcc.type"
          label="Type"
          class="w-full"
          :options="contentSelectOptions"
          :rules="[validators.required, (v) => newUpgradeAcc.type !== 0 || 'Please choose Type']"
          name="type"
          value-by="value"
          option-label="text"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newUpgradeAcc.price" class="w-full sm:w-1/2" placeholder="0.00" label="Price">
          <template #prependInner>
            <span v-html="CURRENCIES_ICONS.VND" />
          </template>
          <template #appendInner>
            <span>{{ CURRENCIES.VND }}</span>
          </template>
        </VaInput>
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaDateInput v-model="newUpgradeAcc.startTime" class="w-full sm:w-1/2" label="StartTime" preset="solid" />
        <VaDateInput v-model="newUpgradeAcc.endTime" class="w-full sm:w-1/2" label="EndTime" preset="solid" />
      </div>
      <VaTextarea v-model="newUpgradeAcc.description" label="Description" class="w-full" name="description" />
      <div class="flex items-center w-1/2 mt-4">
        <VaCheckbox v-model="newUpgradeAcc.isActive" label="IsActive" class="w-full" name="active" />
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
