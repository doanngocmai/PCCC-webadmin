<script setup lang="ts">
import { ref } from 'vue'
import BuildingsTable from './widgets/BuildingsTable.vue'
import EditBuildingForm from './widgets/EditBuildingForm.vue'
import { Building } from './types'
import { useBuildings } from './composables/useBuildings'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditBuildingModal = ref(false) //khởi tạo show modal = false

const { isLoading, filters, sorting, pagination, buildings, ...buildingsApi } = useBuildings() // lấy các biến từ useBuildings.ts

const buildingToEdit = ref<Building | null>(null)
const showEditBuildingModal = (building: Building) => {
  console.log(building)
  buildingToEdit.value = building // check có data thì hiện modal edit
  doShowEditBuildingModal.value = true //gán modal = true
}

const showAddBuildingModal = () => {
  buildingToEdit.value = null
  doShowEditBuildingModal.value = true
}

const { init: notify } = useToast()

const hasError = ref(false)
const onContentSaved = async (building: Building) => {
  if (buildingToEdit.value) {
    try {
      await buildingsApi.update(building)
      hasError.value = false
    } catch (error) {
      hasError.value = true
    }
  } else {
    try {
      await buildingsApi.add(building)
      hasError.value = false
    } catch (error) {
      hasError.value = true
    }
  }
  if (hasError.value) {
    doShowEditBuildingModal.value = true
  }
}
const onBuildingDelete = async (building: Building) => {
  const res = await buildingsApi.remove(building)
  console.log(res)
  notify({
    message: `${building.name} has been deleted`,
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
  <h1 class="page-title">Buildings</h1>

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
        <VaButton @click="showAddBuildingModal">Add Building</VaButton>
      </div>

      <BuildingsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :buildings="buildings"
        :loading="isLoading"
        :pagination="pagination"
        @editBuiding="showEditBuildingModal"
        @deleteBuiding="onBuildingDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditBuildingModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ buildingToEdit ? 'Edit building' : 'Add building' }}</h1>
    <EditBuildingForm
      ref="editFormRef"
      :building="buildingToEdit"
      :save-button-label="buildingToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (building) => {
          onContentSaved(building)
          ok()
        }
      "
    />
  </VaModal>
</template>
