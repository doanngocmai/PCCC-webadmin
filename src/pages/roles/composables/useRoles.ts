import { Ref, ref, unref, watch } from 'vue'
import { getRoles, type Filters, Pagination, Sorting, addRole, updateRole, removeRole } from '../../../data/pages/roles'
import { Role } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useRoles = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const roles = ref<Role[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getRoles({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    roles.value = data
    console.log(data)

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(
    filters,
    () => {
      // Reset pagination to first page when filters changed
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  return {
    isLoading,

    filters,
    sorting,
    pagination,

    roles,

    fetch,

    async add(role: Role) {
      isLoading.value = true
      await addRole(role)
      await fetch()
      isLoading.value = false
    },

    async update(role: Role) {
      isLoading.value = true
      await updateRole(role)
      await fetch()
      isLoading.value = false
    },

    async remove(role: Role) {
      isLoading.value = true
      await removeRole(role)
      await fetch()
      isLoading.value = false
    },
  }
}
