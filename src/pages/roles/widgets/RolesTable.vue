<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Role } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/roles'
import { useVModel } from '@vueuse/core'
import moment from 'moment'

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'id', sortable: true },
  { label: 'RoleName', key: 'roleName', sortable: true },
  { label: 'DisplayName', key: 'displayName', sortable: true },
  { label: 'IsActive', key: 'isActive', sortable: true },
  { label: 'CreationTime', key: 'creationTime', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  roles: {
    type: Array as PropType<Role[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-role', role: Role): void
  (event: 'delete-role', role: Role): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const roles = toRef(props, 'roles')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onUserDelete = async (role: Role) => {
  const agreed = await confirm({
    title: 'Delete role',
    message: `Are you sure you want to delete ${role.roleName}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-role', role)
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
    :items="roles"
    :loading="$props.loading"
  >
    <template #cell(ID)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.id }}
      </div>
    </template>

    <template #cell(roleName)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.roleName }}
      </div>
    </template>

    <template #cell(displayName)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.displayName }}
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
          aria-label="Edit role"
          @click="$emit('edit-role', rowData as Role)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete role"
          @click="onUserDelete(rowData as Role)"
        />
      </div>
    </template>
  </VaDataTable>

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
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
