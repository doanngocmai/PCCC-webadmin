import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { ApartmentUser } from '../../pages/apartmentUsers/types'
import apartmentUserApi from '../../pages/apartmentUsers/api/ApartmentUserApi'
import { useToast } from 'vuestic-ui'

const { notify } = useToast()
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof ApartmentUser | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}
export const getBuildingById = async (buildingId: number) => {
  try {
    console.log(buildingId)
    const res = await apartmentUserApi.getBuildingById(buildingId)
    return res
  } catch (error) {
    console.log(error)
    console.error('Error fetching apartment:', error)
  }
}
export const getBuildings = async (filters?: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const number = ref(0)
  const apartments = ref<ApartmentUser[]>([])
  const { page = 1, perPage = 10, search, sortBy, sortingOrder } = filters || {}

  try {
    const response = await apartmentUserApi.getListApartmentUser(filters)
    console.log(response)
    number.value = response.data.totalItemCount
    apartments.value = response.data.data
    // apartments.value = apartments.value.filter((apartment) => apartment.isActive === isActive)
    console.log(apartments.value)
    if (search) {
      apartments.value = apartments.value.filter((apartment) =>
        apartment.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    apartments.value = apartments.value.map((apartment) => ({ ...apartment }))

    if (sortBy && sortingOrder) {
      apartments.value = apartments.value.sort((a, b) => {
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
    console.error('Error fetching apartment list:', error)
  }

  return {
    data: apartments.value,
    pagination: {
      page,
      perPage,
      total: number.value,
    },
  }
}

const hasError = ref(false)

export const addBuilding = async (apartment: ApartmentUser) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await apartmentUserApi.createBuilding(apartment)
    if (!!res && res.status === 1) {
      return { res, hasError }
    }
    await getBuildings() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to create apartment' }
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
export const updateBuilding = async (apartment: ApartmentUser) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await apartmentUserApi.updateBuilding(apartment)

    if (!!res && res.status === 1) {
      return { res, hasError }
    }

    await getBuildings() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to update apartment' }
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

export const removeBuilding = async (apartment: ApartmentUser) => {
  const res = await apartmentUserApi.deleteBuilding(apartment.id)
  console.log(res)
  await getBuildings()
}
