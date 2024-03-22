<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Content } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/contents'
import { useVModel } from '@vueuse/core'
import moment from 'moment'

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'id', sortable: true },
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Type', key: 'type', sortable: true },
  { label: 'IsActive', key: 'isActive', sortable: true },
  { label: 'CreationTime', key: 'creationTime', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  contents: {
    type: Array as PropType<Content[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-content', content: Content): void
  (event: 'delete-content', content: Content): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const contents = toRef(props, 'contents')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onUserDelete = async (content: Content) => {
  const agreed = await confirm({
    title: 'Delete content',
    message: `Are you sure you want to delete ${content.name}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-content', content)
  }
}
const formatTypes = (type: number) => {
  if (type === 0) return 'No types'
  if (type === 1) {
    return 'Banner'
  }
  if (type === 2) {
    return 'Footer'
  }
  if (type === 3) {
    return 'Contact'
  }
}
const formatActives = (isActive: boolean) => {
  if (isActive === true) {
    return 'Đang hoạt động'
  }
  if (isActive === false) {
    return 'Ngưng hoạt động'
  }
}
const format_date = (value: Date) => {
  return moment(String(value)).format('DD/MM/YYYY hh:mm')
}
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="contents"
    :loading="$props.loading"
  >
    <template #cell(ID)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.id }}
      </div>
    </template>

    <template #cell(name)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.name }}
      </div>
    </template>

    <template #cell(type)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ formatTypes(rowData.type) }}
      </div>
    </template>
    <template #cell(isActive)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ formatActives(rowData.isActive) }}
      </div>
    </template>
    <template #cell(creationTime)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ format_date(rowData.creationTime) }}
      </div>
    </template>
    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit content"
          @click="$emit('edit-content', rowData as Content)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete content"
          @click="onUserDelete(rowData as Content)"
        />
      </div>
    </template>
  </VaDataTable>

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[2, 10, 50, 100]" />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
