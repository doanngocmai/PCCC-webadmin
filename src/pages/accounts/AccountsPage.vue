<script setup lang="ts">
import { ref } from 'vue'
import { User } from './typeAccounts'
import { useUsers } from './composables/useAccounts'
import { useModal, useToast } from 'vuestic-ui'
import AccountsTable from './widgets/AccountsTable.vue'
import EditAccountForm from './widgets/EditAccountForm.vue'

const doShowEditUserModal = ref(false)

const { users, isLoading, filters, sorting, pagination, ...usersApi } = useUsers()

const userToEdit = ref<User | null>(null)

const showEditUserModal = (user: User) => {
  userToEdit.value = user
  doShowEditUserModal.value = true
}

const showAddUserModal = () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
}

const { init: notify } = useToast()

const onUserSaved = async (user: User) => {
  if (userToEdit.value) {
    const { hasError } = await usersApi.update(user)
    doShowEditUserModal.value = hasError?.value === true
  } else {
    const { hasError } = await usersApi.add(user)
    doShowEditUserModal.value = hasError?.value === true
  }
}

const onUserDelete = async (user: User) => {
  await usersApi.remove(user)
  notify({
    message: `${user.userName} has been deleted`,
    color: 'success',
  })
}

const editFormRef = ref()

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}
</script>

<template>
  <h1 class="page-title">Users</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="filters.isActive"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: 1 },
              { label: 'Inactive', value: 0 },
            ]"
          />
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddUserModal">Add User</VaButton>
      </div>

      <AccountsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @editUser="showEditUserModal"
        @deleteUser="onUserDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel }"
    v-model="doShowEditUserModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ userToEdit ? 'Edit user' : 'Add user' }}</h1>
    <EditAccountForm
      ref="editFormRef"
      :user="userToEdit"
      :save-button-label="userToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (user) => {
          onUserSaved(user)
        }
      "
    />
  </VaModal>
</template>
./composables/useAccounts./widgets/EditAccountForm.vue./typeAccounts
