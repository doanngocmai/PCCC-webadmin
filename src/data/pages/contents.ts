import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { Content } from '../../pages/contents/types'
import contentApi from '../../pages/contents/api/ContentApi'
import { useToast } from 'vuestic-ui'

const { notify } = useToast()
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

export const getContents = async (filters?: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const number = ref(0)
  const contents = ref<Content[]>([])
  const { page = 1, perPage = 10, isActive, search, sortBy, sortingOrder } = filters || {}

  try {
    const response = await contentApi.getListContent(filters)
    number.value = response.data.totalItemCount
    contents.value = response.data.data
    contents.value = contents.value.filter((content) => content.isActive === isActive)

    if (search) {
      contents.value = contents.value.filter((content) => content.name.toLowerCase().includes(search.toLowerCase()))
    }

    contents.value = contents.value.map((content) => ({ ...content }))

    if (sortBy && sortingOrder) {
      contents.value = contents.value.sort((a, b) => {
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
  } catch (error) {
    console.error('Error fetching content list:', error)
  }

  return {
    data: contents.value,
    pagination: {
      page,
      perPage,
      total: number.value,
    },
  }
}

const hasError = ref(false)

export const addContent = async (content: Content) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await contentApi.createContent(content)
    if (!!res && res.status === 1) {
      return { res, hasError }
    }
    await getContents() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to create content' }
  } catch (error: any) {
    hasError.value = true

    if (error?.response?.data?.code === 1) {
      notify({
        message: `${error.response.data.message}`,
        color: 'danger',
      })
      return { hasError }
    } else {
      console.error('Unhandled error:', error)
      notify({
        message: `The system is maintenance`,
        color: 'danger',
      })
    }

    return { error: error.message || 'Unknown error occurred' }
  }
}
export const updateContent = async (content: Content) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await contentApi.updateContent(content)

    if (!!res && res.status === 1) {
      return { res, hasError }
    }

    await getContents() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to update content' }
  } catch (error: any) {
    hasError.value = true

    if (error?.response?.data?.code === 1) {
      notify({
        message: `${error.response.data.message}`,
        color: 'danger',
      })
      return { hasError }
    } else {
      console.error('Unhandled error:', error)
      notify({
        message: `The system is maintenance`,
        color: 'danger',
      })
    }

    return { error: error.message || 'Unknown error occurred' }
  }
}

export const removeContent = async (content: Content) => {
  await sleep(1000)
  const res = await contentApi.deleteContent(content.id)
  console.log(res)
  await getContents()
}
