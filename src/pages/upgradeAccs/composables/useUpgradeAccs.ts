import { Ref, ref, unref, watch } from 'vue'
import {
  getUpgradeAccs,
  type Filters,
  Pagination,
  Sorting,
  addUpgradeAccs,
  updateUpgradeAcc,
  removeUpgradeAcc,
} from '../../../data/pages/upgradeAccs'
import { UpgradeAcc } from '../types'
import { watchIgnorable } from '@vueuse/core'
import { useToast } from 'vuestic-ui'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

const { notify } = useToast()

export const useUpgradeAccs = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const upgrades = ref<UpgradeAcc[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}
  // Định nghĩa hàm fetch để tải dữ liệu từ API sử dụng các filters, sorting và pagination hiện tại.
  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getUpgradeAccs({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    upgrades.value = data
    console.log(upgrades.value)

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

    upgrades,

    fetch,

    async add(item: UpgradeAcc) {
      try {
        isLoading.value = true
        const { res } = await addUpgradeAccs(item)
        if (!!res && res.status === 1) {
          notify({
            message: `${item.title} has been created`,
            color: 'success',
          })
        }
      } finally {
        await fetch()
        isLoading.value = false
      }
    },

    async update(item: UpgradeAcc) {
      try {
        isLoading.value = true
        const { res } = await updateUpgradeAcc(item)
        if (!!res && res.status === 1) {
          notify({
            message: `${item.title} has been updated`,
            color: 'success',
          })
        }
      } finally {
        await fetch()
        isLoading.value = false
      }
    },

    async remove(item: UpgradeAcc) {
      isLoading.value = true
      await removeUpgradeAcc(item)
      await fetch()
      isLoading.value = false
    },
  }
}
