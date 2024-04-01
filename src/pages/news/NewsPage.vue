<script setup lang="ts">
import { ref } from 'vue'
import NewsTable from './widgets/NewsTable.vue'
import EditNewForm from './widgets/EditNewForm.vue'
import { New } from './types'
import { useNews } from './composables/useNews'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditNewModal = ref(false) //khởi tạo show modal = false

const { isLoading, filters, sorting, pagination, news, ...newsApi } = useNews() // lấy các biến từ useContents.ts

const newToEdit = ref<New | null>(null) // khởi tạo roleToEdit = New trong types.ts

const showEditNewModal = (item: New) => {
  newToEdit.value = item // check có data thì hiện modal edit
  console.log(item)
  doShowEditNewModal.value = true //gán modal = true
}

const showAddNewModal = () => {
  newToEdit.value = null
  doShowEditNewModal.value = true
}

const { init: notify } = useToast()

const hasError = ref(false)

const onNewSaved = async (item) => {
  try {
    if (newToEdit.value) {
      await newsApi.update(item)
    } else {
      await newsApi.add(item)
    }
    hasError.value = false
  } catch (error) {
    hasError.value = true
  }

  if (hasError.value) {
    doShowEditNewModal.value = true
  }
}
const onNewDelete = async (item: New) => {
  const res = await newsApi.remove(item)
  console.log(res)
  notify({
    message: `${item.title} has been deleted`,
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
  <h1 class="page-title">News</h1>

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
        <VaButton @click="showAddNewModal">Add New</VaButton>
      </div>

      <NewsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :news="news"
        :loading="isLoading"
        :pagination="pagination"
        @editNew="showEditNewModal"
        @deleteNew="onNewDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel }"
    v-model="doShowEditNewModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ newToEdit ? 'Edit New' : 'Add New' }}</h1>
    <EditNewForm
      ref="editFormRef"
      :item="newToEdit"
      :save-button-label="newToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (item) => {
          onNewSaved(item)
        }
      "
    />
  </VaModal>
</template>
