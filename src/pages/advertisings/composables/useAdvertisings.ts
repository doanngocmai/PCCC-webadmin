import { Ref, ref, unref, watch } from 'vue'
import {
  getAdvertisings,
  type Filters,
  Pagination,
  Sorting,
  createAdvertising,
  updateAdvertising,
  removeAdvertising,
} from '../../../data/pages/advertisings'
import { Advertising } from '../typeAds'
import { watchIgnorable } from '@vueuse/core'
import { useToast } from 'vuestic-ui'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

const { notify } = useToast()

export const useAdvertisings = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const advertisings = ref<Advertising[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}
  // Định nghĩa hàm fetch để tải dữ liệu từ API sử dụng các filters, sorting và pagination hiện tại.
  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getAdvertisings({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    advertisings.value = data
    console.log(advertisings.value)

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

    advertisings,

    fetch,

    async add(advertising: Advertising) {
      try {
        isLoading.value = true
        const { res, hasError } = await createAdvertising(advertising)
        if (!!res && res.status === 1) {
          notify({
            message: `${advertising.name} has been created`,
            color: 'success',
          })
          return {
            hasError,
          }
        }
        return {
          hasError,
        }
      } finally {
        await fetch()
        isLoading.value = false
      }
    },

    async update(advertising: Advertising) {
      try {
        isLoading.value = true
        const { res, hasError } = await updateAdvertising(advertising)
        if (!!res && res.status === 1) {
          notify({
            message: `${advertising.name} has been updated`,
            color: 'success',
          })
          return {
            hasError,
          }
        }
        return {
          hasError,
        }
      } finally {
        await fetch()
        isLoading.value = false
      }
    },

    async remove(advertising: Advertising) {
      isLoading.value = true
      await removeAdvertising(advertising)
      await fetch()
      isLoading.value = false
    },
  }
}
