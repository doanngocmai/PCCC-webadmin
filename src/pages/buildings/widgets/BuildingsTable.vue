<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Building } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/buildings'
import { useVModel } from '@vueuse/core'
import moment from 'moment'

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'id', sortable: true },
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Address', key: 'address', sortable: true },
  { label: 'FloorCount', key: 'floorCount', sortable: true },
  { label: 'CreationTime', key: 'creationTime', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  buildings: {
    type: Array as PropType<Building[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-building', building: Building): void
  (event: 'delete-building', building: Building): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const buildings = toRef(props, 'buildings')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onBuildingDelete = async (building: Building) => {
  const agreed = await confirm({
    title: 'Delete building',
    message: `Are you sure you want to delete ${building.name}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-building', building)
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
    :items="buildings"
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

    <template #cell(address)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.address }}
      </div>
    </template>

    <template #cell(floorCount)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.floorCount }}
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
          aria-label="Edit building"
          @click="$emit('edit-building', rowData as Building)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete building"
          @click="onBuildingDelete(rowData as Building)"
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
