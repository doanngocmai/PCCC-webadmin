<script setup lang="ts">
import { ref } from 'vue'
import ContentsTable from './widgets/ContentsTable.vue'
import EditContentForm from './widgets/EditContentForm.vue'
import { Content } from './types'
import { useContents } from './composables/useContents'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditContentModal = ref(false) //khởi tạo show modal = false

const { isLoading, filters, sorting, pagination, contents, ...contentsApi } = useContents() // lấy các biến từ useContents.ts

const contentToEdit = ref<Content | null>(null) // khởi tạo roleToEdit = Content trong types.ts

const showEditContentModal = (content: Content) => {
  contentToEdit.value = content // check có data thì hiện modal edit
  doShowEditContentModal.value = true //gán modal = true
}

const showAddContentModal = () => {
  contentToEdit.value = null
  doShowEditContentModal.value = true
}

const { init: notify } = useToast()

const onContentSaved = async (content: Content) => {
  if (contentToEdit.value) {
    console.log(contentToEdit.value)
    const res = await contentsApi.update(content)
    console.log(res)
    notify({
      message: `${content.name} has been updated`,
      color: 'success',
    })
  } else {
    const response = await contentsApi.add(content)
    console.log(response)
    notify({
      message: `${content.name} has been created`,
      color: 'success',
    })
  }
}

const onContentDelete = async (content: Content) => {
  const res = await contentsApi.remove(content)
  console.log(res)
  notify({
    message: `${content.name} has been deleted`,
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
  <h1 class="page-title">Contents</h1>

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
        <VaButton @click="showAddContentModal">Add Content</VaButton>
      </div>

      <ContentsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :contents="contents"
        :loading="isLoading"
        :pagination="pagination"
        @editContent="showEditContentModal"
        @deleteContent="onContentDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditContentModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ contentToEdit ? 'Edit content' : 'Add content' }}</h1>
    <EditContentForm
      ref="editFormRef"
      :content="contentToEdit"
      :save-button-label="contentToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (content) => {
          onContentSaved(content)
          ok()
        }
      "
    />
  </VaModal>
</template>
