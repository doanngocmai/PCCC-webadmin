import { Ref, ref, unref, watch } from 'vue'
import {
  getContents,
  type Filters,
  Pagination,
  Sorting,
  addContent,
  updateContent,
  removeContent,
} from '../../../data/pages/contents'
import { Content } from '../types'
import { watchIgnorable } from '@vueuse/core'
import { useToast } from 'vuestic-ui'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

const { notify } = useToast()

export const useContents = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const contents = ref<Content[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}
  // Định nghĩa hàm fetch để tải dữ liệu từ API sử dụng các filters, sorting và pagination hiện tại.
  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getContents({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    contents.value = data

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

    contents,

    fetch,

    async add(content: Content) {
      isLoading.value = true
      await addContent(content)
      await fetch()
      isLoading.value = false
    },

    async update(content: Content) {
      try {
        isLoading.value = true
        const { res } = await updateContent(content)
        if (!!res && res.status === 1) {
          notify({
            message: `${content.name} has been updated`,
            color: 'success',
          })
        }
      } finally {
        await fetch()
        isLoading.value = false
      }
    },

    async remove(content: Content) {
      isLoading.value = true
      await removeContent(content)
      await fetch()
      isLoading.value = false
    },
  }
}
