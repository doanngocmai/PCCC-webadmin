import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { Content } from '../../pages/contents/types'
import contentApi from '../../pages/contents/api/ContentApi'

// export const contents = content as Content[]

const contents = ref<Content[]>([])

const fetchContentList = async () => {
  try {
    const response = await contentApi.getListContent(null)
    contents.value = response.data.data
    console.log(response)
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching content list:', error)
  }
}
// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Content | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}

export const getContents = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  await fetchContentList()
  const { isActive, search, sortBy, sortingOrder } = filters
  const filteredContents = contents
  console.log(contents.value.slice())

  filteredContents.value = filteredContents.value.filter((content) => content.isActive === isActive)

  if (search) {
    filteredContents.value = filteredContents.value.filter((content) =>
      content.name.toLowerCase().includes(search.toLowerCase()),
    )
  }

  filteredContents.value = filteredContents.value.map((content) => ({ ...content }))

  if (sortBy && sortingOrder) {
    filteredContents.value = filteredContents.value.sort((a, b) => {
      const first = getSortItem(a, sortBy)
      const second = getSortItem(b, sortBy)
      if (first > second) {
        return sortingOrder === 'asc' ? 1 : -1
      }
      if (first < second) {
        return sortingOrder === 'asc' ? -1 : 1
      }
      return 0
    })
  }
  console.log(filteredContents)
  console.log(filteredContents.value)

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredContents.value.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredContents.value.length,
    },
  }
}

export const addContent = async (content: Content) => {
  await sleep(1000)
  const res = await contentApi.createContent(content)
  console.log(res)
  await fetchContentList()
}

export const updateContent = async (content: Content) => {
  await sleep(1000)
  await contentApi.updateContent(content)
  await fetchContentList()
}

export const removeContent = async (content: Content) => {
  await sleep(1000)
  await contentApi.deleteContent(content.id)
  await fetchContentList()
}
