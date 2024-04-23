<script setup lang="ts">
import { ref } from 'vue'
import AdvertisingTable from './widgets/AdvertisingTable.vue'
import EditAdvertisingForm from './widgets/EditAdvertisingForm.vue'
import { Advertising } from './typeAds'
import { useAdvertisings } from './composables/useAdvertisings'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditAdsModal = ref(false) //khởi tạo show modal = false

const { isLoading, filters, sorting, pagination, advertisings, ...advertisingApi } = useAdvertisings()

const advertisingToEdit = ref<Advertising | null>(null)

const showEditAdsModal = (advertising: Advertising) => {
  advertisingToEdit.value = advertising // check có data thì hiện modal edit
  console.log(advertising)
  doShowEditAdsModal.value = true //gán modal = true
}

const showAddAdsModal = () => {
  advertisingToEdit.value = null
  doShowEditAdsModal.value = true
}

const { init: notify } = useToast()

const onAdsSaved = async (advertising: Advertising) => {
  if (advertisingToEdit.value) {
    const { hasError } = await advertisingApi.update(advertising)
    doShowEditAdsModal.value = hasError?.value === true
  } else {
    const { hasError } = await advertisingApi.add(advertising)
    doShowEditAdsModal.value = hasError?.value === true
  }
}
const onAdsDelete = async (advertising: Advertising) => {
  const res = await advertisingApi.remove(advertising)
  console.log(res)
  notify({
    message: `${advertising.name} has been deleted`,
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
  <h1 class="page-title">Advertisings</h1>

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
        <VaButton @click="showAddAdsModal">Add Advertising</VaButton>
      </div>

      <AdvertisingTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :advertisings="advertisings"
        :loading="isLoading"
        :pagination="pagination"
        @editAdvertising="showEditAdsModal"
        @deleteAdvertising="onAdsDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel }"
    v-model="doShowEditAdsModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ advertisingToEdit ? 'Edit Advertising' : 'Add Advertising' }}</h1>
    <EditAdvertisingForm
      ref="editFormRef"
      :advertising="advertisingToEdit"
      :save-button-label="advertisingToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (advertising) => {
          onAdsSaved(advertising)
        }
      "
    />
  </VaModal>
</template>
