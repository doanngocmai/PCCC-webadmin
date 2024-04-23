<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Advertising, TypeAdvertising, TextTypeAdvertising } from '../typeAds'
import { validators } from '../../../services/utils'
import { CURRENCIES, CURRENCIES_ICONS } from '../../accounts/typeAccounts'

const props = defineProps({
  advertising: {
    type: Object as PropType<Advertising | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewContent: Advertising = {
  id: -1,
  name: '',
  price: 0,
  content: '',
  type: 0,
  startTime: new Date(),
  endTime: new Date(),
  isActive: true,
}

const newAdvertising = ref<Advertising>({ ...defaultNewContent })

const contentSelectOptions: { text: Capitalize<TextTypeAdvertising>; value: TypeAdvertising }[] = [
  { text: 'Please Choose Type', value: 0 },
  { text: 'Banner', value: 1 },
  { text: 'Footer', value: 2 },
  { text: 'Contact', value: 3 },
]
const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newAdvertising.value).some((key) => {
    if (key === 'image') {
      return false
    }

    return (
      newAdvertising.value[key as keyof Advertising] !==
      (props.advertising ?? defaultNewContent)?.[key as keyof Advertising]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.advertising,
  () => {
    if (!props.advertising) {
      return
    }

    newAdvertising.value = {
      ...props.advertising,
    }
  },
  { immediate: true },
)
const form = useForm('add-advertising-form')
console.log(form)

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newAdvertising.value)
  }
}
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-advertising-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newAdvertising.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaSelect
          v-model="newAdvertising.type"
          label="Type"
          class="w-full"
          :options="contentSelectOptions"
          :rules="[validators.required, (v) => newAdvertising.type !== 0 || 'Please choose Type']"
          name="type"
          value-by="value"
          option-label="text"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newAdvertising.price" class="w-full sm:w-1/2" placeholder="0.00" label="Price">
          <template #prependInner>
            <span v-html="CURRENCIES_ICONS.VND" />
          </template>
          <template #appendInner>
            <span>{{ CURRENCIES.VND }}</span>
          </template>
        </VaInput>
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaDateInput v-model="newAdvertising.startTime" class="w-full sm:w-1/2" label="StartTime" preset="solid" />
        <VaDateInput v-model="newAdvertising.endTime" class="w-full sm:w-1/2" label="EndTime" preset="solid" />
      </div>
      <VaTextarea v-model="newAdvertising.content" label="Content" class="w-full" name="content" />
      <div class="flex items-center w-1/2 mt-4">
        <VaCheckbox v-model="newAdvertising.isActive" label="IsActive" class="w-full" name="active" />
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
