<script setup lang="ts">
import { ref } from 'vue'
import ApartmentUsersTable from './widgets/ApartmentUsersTable.vue'
import EditApartmentUserForm from './widgets/EditApartmentUserForm.vue'
import { ApartmentUser } from './types'
import { useApartmentUsers } from './composables/useApartmentUsers'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditApartmentModal = ref(false) //khởi tạo show modal = false

const { isLoading, filters, sorting, pagination, apartments, ...apartmentsApi } = useApartmentUsers() // lấy các biến từ useBuildings.ts

const apartmentToEdit = ref<ApartmentUser | null>(null)
const showEditApartmentModal = (apartment: ApartmentUser) => {
  apartmentToEdit.value = apartment // check có data thì hiện modal edit
  console.log(apartment)
  doShowEditApartmentModal.value = true //gán modal = true
}

const showAddApartmentModal = () => {
  apartmentToEdit.value = null
  doShowEditApartmentModal.value = true
}

const { init: notify } = useToast()

const onApartmentSaved = async (apartment: ApartmentUser) => {
  if (apartmentToEdit.value) {
    const { hasError } = await apartmentsApi.update(apartment)
    doShowEditApartmentModal.value = hasError?.value === true
  } else {
    const { hasError } = await apartmentsApi.add(apartment)
    doShowEditApartmentModal.value = hasError?.value === true
  }
}

const onApartmentDelete = async (apartment: ApartmentUser) => {
  const res = await apartmentsApi.remove(apartment)
  console.log(res)
  notify({
    message: `${apartment.name} has been deleted`,
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
  <h1 class="page-title">ApartmentUsers</h1>

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
        <VaButton @click="showAddApartmentModal">Add Apartment</VaButton>
      </div>

      <ApartmentUsersTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :apartments="apartments"
        :loading="isLoading"
        :pagination="pagination"
        @editApartment="showEditApartmentModal"
        @deleteApartment="onApartmentDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditApartmentModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ apartmentToEdit ? 'Edit Apartment' : 'Add Apartment' }}</h1>
    <EditApartmentUserForm
      ref="editFormRef"
      :apartment="apartmentToEdit"
      :save-button-label="apartmentToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (apartment) => {
          onApartmentSaved(apartment)
          ok()
        }
      "
    />
  </VaModal>
</template>
