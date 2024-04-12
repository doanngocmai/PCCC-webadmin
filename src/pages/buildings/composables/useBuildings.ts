import { Ref, ref, unref, watch } from 'vue'
import {
  getBuildings,
  type Filters,
  Pagination,
  Sorting,
  addBuilding,
  updateBuilding,
  removeBuilding,
} from '../../../data/pages/buildings'
import { Building } from '../types'
import { watchIgnorable } from '@vueuse/core'
import { useToast } from 'vuestic-ui'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

const { notify } = useToast()

export const useBuildings = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const buildings = ref<Building[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}
  // Định nghĩa hàm fetch để tải dữ liệu từ API sử dụng các filters, sorting và pagination hiện tại.
  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getBuildings({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    buildings.value = data

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }
  //Sử dụng watchIgnorable để theo dõi sự thay đổi của pagination và sorting, và tự động gọi hàm fetch() khi có sự thay đổi
  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })
  // Sử dụng watch để theo dõi sự thay đổi của filters, và reset pagination về trang đầu tiên khi có sự thay đổi, sau đó gọi hàm fetch()
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

    buildings,

    fetch,

    async add(building: Building) {
      try {
        isLoading.value = true
        const { res } = await addBuilding(building)
        if (!!res && res.status === 1) {
          notify({
            message: `${building.name} has been created`,
            color: 'success',
          })
        }
      } finally {
        await fetch()
        isLoading.value = false
      }
    },

    async update(building: Building) {
      try {
        isLoading.value = true
        const { res } = await updateBuilding(building)
        if (!!res && res.status === 1) {
          notify({
            message: `${building.name} has been updated`,
            color: 'success',
          })
        }
      } finally {
        await fetch()
        isLoading.value = false
      }
    },

    async remove(building: Building) {
      isLoading.value = true
      await removeBuilding(building)
      await fetch()
      isLoading.value = false
    },
  }
}
