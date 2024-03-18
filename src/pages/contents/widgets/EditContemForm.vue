<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Content } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  role: {
    type: Object as PropType<Content | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewRole: Content = {
  id: -1,
  roleName: '',
  displayName: '',
  note: '',
  isActive: true,
}

const newRole = ref<Content>({ ...defaultNewRole })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newRole.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newRole.value[key as keyof Content] !== (props.role ?? defaultNewRole)?.[key as keyof Content]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.role,
  () => {
    if (!props.role) {
      return
    }

    newRole.value = {
      ...props.role,
    }
  },
  { immediate: true },
)

const form = useForm('add-role-form')
console.log(form)

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    console.log(newRole.value)
    emit('save', newRole.value)
  }
}
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-role-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newRole.roleName"
          label="Content Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="roleName"
          aria-disabled="true"
        />
        <VaInput
          v-model="newRole.displayName"
          label="Display Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="displayName"
        />
      </div>
      <div class="flex items-center w-1/2 mt-4">
        <VaCheckbox v-model="newRole.isActive" label="IsActive" class="w-full" name="active" />
      </div>
    </div>
    <VaTextarea v-model="newRole.note" label="Note" class="w-full" name="note" />

    <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>
