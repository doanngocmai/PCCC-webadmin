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

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useContents = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const contents = ref<Content[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getContents({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    contents.value = data
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

    contents,

    fetch,

    async add(content: Content) {
      isLoading.value = true
      await addContent(content)
      await fetch()
      isLoading.value = false
    },

    async update(content: Content) {
      isLoading.value = true
      await updateContent(content)
      await fetch()
      isLoading.value = false
    },

    async remove(content: Content) {
      isLoading.value = true
      await removeContent(content)
      await fetch()
      isLoading.value = false
    },
  }
}
