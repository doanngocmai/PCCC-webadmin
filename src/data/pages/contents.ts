import { ref, onMounted } from 'vue'
import { sleep } from '../../services/utils'
import { Content } from '../../pages/contents/types'
import contentApi from '../../pages/contents/api/ContentApi'

// export const roles = content as Content[]

const roles = ref<Content[]>([])

const fetchRoleList = async () => {
  try {
    const response = await contentApi.getListContent(null)
    roles.value = response.data.data
  } catch (error) {
    console.error('Error fetching role list:', error)
  }
}

onMounted(() => {
  fetchRoleList()
})

// Function to refresh role list
const refreshRoleList = async () => {
  await fetchRoleList()
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
  const { isActive, search, sortBy, sortingOrder } = filters
  const filteredContents = roles
  console.log(roles)

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
  await contentApi.createContent(content)
  await refreshRoleList()
}

export const updateContent = async (content: Content) => {
  await sleep(1000)
  await contentApi.updateContent(content)
  await refreshRoleList()
}

export const removeContent = async (content: Content) => {
  await sleep(1000)
  await contentApi.deleteContent(content.id)
  await refreshRoleList()
}
