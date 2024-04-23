<script setup lang="ts">
import { ref } from 'vue'
import UpgradeAccsTable from './widgets/UpgradeAccsTable.vue'
import EditUpgradeForm from './widgets/EditUpgradeForm.vue'
import { UpgradeAcc } from './types'
import { useUpgradeAccs } from './composables/useUpgradeAccs'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUpgradeModal = ref(false) //khởi tạo show modal = false

const { isLoading, filters, sorting, pagination, upgrades, ...upgradeAccsApi } = useUpgradeAccs() // lấy các biến từ useContents.ts

const upgradeToEdit = ref<UpgradeAcc | null>(null) // khởi tạo roleToEdit = UpgradeAcc trong types.ts

const showEditUpgradeModal = (upgrade: UpgradeAcc) => {
  upgradeToEdit.value = upgrade // check có data thì hiện modal edit
  console.log(upgrade)
  doShowEditUpgradeModal.value = true //gán modal = true
}

const showAddUpgradeModal = () => {
  upgradeToEdit.value = null
  doShowEditUpgradeModal.value = true
}

const { init: notify } = useToast()

const onUpgradeSaved = async (item: UpgradeAcc) => {
  if (upgradeToEdit.value) {
    const { hasError } = await upgradeAccsApi.update(item)
    doShowEditUpgradeModal.value = hasError?.value === true
  } else {
    const { hasError } = await upgradeAccsApi.add(item)
    doShowEditUpgradeModal.value = hasError?.value === true
  }
}

const onUpgradeDelete = async (upgrade: UpgradeAcc) => {
  const res = await upgradeAccsApi.remove(upgrade)
  console.log(res)
  notify({
    message: `${upgrade.name} has been deleted`,
    color: 'error',
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
  <h1 class="page-title">Upgrade Accounts</h1>

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
        <VaButton @click="showAddUpgradeModal">Add Upgrade Account</VaButton>
      </div>

      <UpgradeAccsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :upgrades="upgrades"
        :loading="isLoading"
        :pagination="pagination"
        @editUpgrade="showEditUpgradeModal"
        @deleteUpgrade="onUpgradeDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel }"
    v-model="doShowEditUpgradeModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ upgradeToEdit ? 'Edit Upgrade Account' : 'Add Upgrade Account' }}</h1>
    <EditUpgradeForm
      ref="editFormRef"
      :upgrade="upgradeToEdit"
      :save-button-label="upgradeToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (upgrade) => {
          onUpgradeSaved(upgrade)
        }
      "
    />
  </VaModal>
</template>
