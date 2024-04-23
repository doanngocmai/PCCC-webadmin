import { Ref, ref, unref, watch } from 'vue'
import { getNews, type Filters, Pagination, Sorting, addNew, updateNew, removeNew } from '../../../data/pages/news'
import { New } from '../types'
import { watchIgnorable } from '@vueuse/core'
import { useToast } from 'vuestic-ui'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

const { notify } = useToast()

export const useNews = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const news = ref<New[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}
  // Định nghĩa hàm fetch để tải dữ liệu từ API sử dụng các filters, sorting và pagination hiện tại.
  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getNews({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    news.value = data
    console.log(news.value)

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

    news,

    fetch,

    async add(item: New) {
      try {
        isLoading.value = true
        const { res, hasError } = await addNew(item)
        if (!!res && res.status === 1) {
          notify({
            message: `${item.title} has been created`,
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

    async update(item: New) {
      try {
        isLoading.value = true
        const { res, hasError } = await updateNew(item)
        if (!!res && res.status === 1) {
          notify({
            message: `${item.title} has been updated`,
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

    async remove(item: New) {
      isLoading.value = true
      await removeNew(item)
      await fetch()
      isLoading.value = false
    },
  }
}
