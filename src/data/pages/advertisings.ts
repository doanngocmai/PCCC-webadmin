import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { Advertising } from '../../pages/advertisings/typeAds'
import advertisingApi from '../../pages/advertisings/api/AdvertisingApi'
import { useToast } from 'vuestic-ui'

const { notify } = useToast()
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Advertising | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}

export const getAdvertisings = async (filters?: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const number = ref(0)
  const advertisings = ref<Advertising[]>([])
  const { page = 1, perPage = 10, isActive, search, sortBy, sortingOrder } = filters || {}

  try {
    const response = await advertisingApi.getListAdvertisings(filters)
    console.log(response)
    number.value = response.data.totalItemCount
    advertisings.value = response.data.data
    advertisings.value = advertisings.value.filter((advertising) => advertising.isActive === isActive)

    if (search) {
      advertisings.value = advertisings.value.filter((advertising) =>
        advertising.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    advertisings.value = advertisings.value.map((advertising) => ({ ...advertising }))

    if (sortBy && sortingOrder) {
      advertisings.value = advertisings.value.sort((a, b) => {
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
    console.error('Error fetching advertising list:', error)
  }

  return {
    data: advertisings.value,
    pagination: {
      page,
      perPage,
      total: number.value,
    },
  }
}

const hasError = ref(false)

export const createAdvertising = async (advertising: Advertising) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await advertisingApi.createAdvertising(advertising)
    if (!!res && res.status === 1) {
      return { res, hasError }
    }
    await getAdvertisings() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to create advertising' }
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
export const updateAdvertising = async (advertising: Advertising) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await advertisingApi.updateAdvertising(advertising)

    if (!!res && res.status === 1) {
      return { res, hasError }
    }

    await getAdvertisings() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to update advertising' }
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

export const removeAdvertising = async (advertising: Advertising) => {
  await sleep(1000)
  const res = await advertisingApi.deleteAdvertising(advertising.id)
  console.log(res)
  await getAdvertisings()
}
