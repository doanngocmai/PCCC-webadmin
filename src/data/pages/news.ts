import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { New } from '../../pages/news/types'
import newApi from '../../pages/news/api/NewApi'
import { useToast } from 'vuestic-ui'

const { notify } = useToast()
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof New | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}

export const getNews = async (filters?: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const number = ref(0)
  const news = ref<New[]>([])
  const { page = 1, perPage = 10, isActive, search, sortBy, sortingOrder } = filters || {}

  try {
    const response = await newApi.getListNew(filters)
    console.log(response)
    number.value = response.data.totalItemCount
    news.value = response.data.data
    news.value = news.value.filter((item) => item.isActive === isActive)

    if (search) {
      news.value = news.value.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    }

    news.value = news.value.map((item) => ({ ...item }))

    if (sortBy && sortingOrder) {
      news.value = news.value.sort((a, b) => {
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
    console.error('Error fetching new list:', error)
  }

  return {
    data: news.value,
    pagination: {
      page,
      perPage,
      total: number.value,
    },
  }
}

const hasError = ref(false)

export const addNew = async (item: New) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await newApi.createNew(item)
    if (!!res && res.status === 1) {
      return { res, hasError }
    }
    await getNews() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to create new' }
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
export const updateNew = async (item: New) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await newApi.updateNew(item)

    if (!!res && res.status === 1) {
      return { res, hasError }
    }

    await getNews() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to update new' }
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

export const removeNew = async (item: New) => {
  await sleep(1000)
  const res = await newApi.deleteNew(item.id)
  console.log(res)
  await getNews()
}
