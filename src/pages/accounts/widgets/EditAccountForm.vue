<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { validators } from '../../../services/utils'
import { User } from '../typeAccounts'

const props = defineProps({
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewUser: User = {
  id: -1,
  fullName: '',
  phone: '',
  email: '',
  address: '',
  userName: '',
  password: '',
  amount: 0,
  isActive: 1,
  sex: true,
}

const newUser = ref<User>({ ...defaultNewUser })

const userRadioOptions = [
  { text: 'Female', value: true },
  { text: 'Male', value: false },
]

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newUser.value[key as keyof User] !== (props.user ?? defaultNewUser)?.[key as keyof User]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.user,
  () => {
    if (!props.user) {
      return
    }

    newUser.value = {
      ...props.user,
    }
  },
  { immediate: true },
)

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newUser.value)
  }
}
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.userName"
          label="Username"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="username"
        />
        <VaInput
          v-model="newUser.fullName"
          label="Full name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="fullname"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.phone"
          label="Phone"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="phone"
        />
        <VaInput
          v-model="newUser.email"
          label="Email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaRadio v-model="newUser.sex" label="Sex" :options="userRadioOptions" />
      </div>
      <div class="flex gap-4 w-full">
        <div class="flex items-center w-1/2 mt-4">
          <VaCheckbox v-model="newUser.isActive" label="IsActive" class="w-full" name="isActive" />
        </div>
      </div>
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
../typeAccounts
