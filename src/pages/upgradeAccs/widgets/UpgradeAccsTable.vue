<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { UpgradeAcc } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/upgradeAccs'
import { useVModel } from '@vueuse/core'
import moment from 'moment'

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'id', sortable: true },
  { label: 'Title', key: 'title', sortable: true },
  { label: 'Type', key: 'type', sortable: true },
  { label: 'IsActive', key: 'isActive', sortable: true },
  { label: 'CreationTime', key: 'creationTime', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  upgrades: {
    type: Array as PropType<UpgradeAcc[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-upgrade', upgrade: UpgradeAcc): void
  (event: 'delete-upgrade', upgrade: UpgradeAcc): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const upgrades = toRef(props, 'upgrades')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onUserDelete = async (upgrade: UpgradeAcc) => {
  const agreed = await confirm({
    title: 'Delete upgrade',
    message: `Are you sure you want to delete ${upgrade.title}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-upgrade', upgrade)
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
    :upgrades="upgrades"
    :loading="$props.loading"
  >
    <template #cell(ID)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.id }}
      </div>
    </template>

    <template #cell(title)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.title }}
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
          aria-label="Edit upgrade"
          @click="$emit('edit-upgrade', rowData as UpgradeAcc)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete upgrade"
          @click="onUserDelete(rowData as UpgradeAcc)"
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
