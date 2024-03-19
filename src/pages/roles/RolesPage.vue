<script setup lang="ts">
import { ref } from 'vue'
import RolesTable from './widgets/RolesTable.vue'
import EditRoleForm from './widgets/EditRoleForm.vue'
import { Role } from './types'
import { useRoles } from './composables/useRoles'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditRoleModal = ref(false) //khởi tạo show modal = false

const { isLoading, filters, sorting, pagination, roles, ...rolesApi } = useRoles() // lấy các biến từ useRoles.ts

const roleToEdit = ref<Role | null>(null) // khởi tạo roleToEdit = Role trong types.ts

const showEditRoleModal = (role: Role) => {
  roleToEdit.value = role // check có data thì hiện modal edit
  doShowEditRoleModal.value = true //gán modal = true
}

const showAddRoleModal = () => {
  roleToEdit.value = null
  doShowEditRoleModal.value = true
}

const { init: notify } = useToast()

const onRoleSaved = async (role: Role) => {
  if (roleToEdit.value) {
    console.log(roleToEdit.value)
    await rolesApi.update(role)
    notify({
      message: `${role.roleName} has been updated`,
      color: 'success',
    })
  } else {
    rolesApi.add(role)
    notify({
      message: `${role.roleName} has been created`,
      color: 'success',
    })
  }
}

const onRoleDelete = async (role: Role) => {
  await rolesApi.remove(role)
  notify({
    message: `${role.roleName} has been deleted`,
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
  <h1 class="page-title">Roles</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="filters.isActive"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]"
          />
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddRoleModal">Add Role</VaButton>
      </div>

      <RolesTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :roles="roles"
        :loading="isLoading"
        :pagination="pagination"
        @editRole="showEditRoleModal"
        @deleteRole="onRoleDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditRoleModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ roleToEdit ? 'Edit role' : 'Add role' }}</h1>
    <EditRoleForm
      ref="editFormRef"
      :role="roleToEdit"
      :save-button-label="roleToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (role) => {
          onRoleSaved(role)
          ok()
        }
      "
    />
  </VaModal>
</template>
