import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { Building } from '../../pages/buildings/types'
import buildingApi from '../../pages/buildings/api/BuildingApi'
import { useToast } from 'vuestic-ui'

const { notify } = useToast()
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Building | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}
export const getBuildingById = async (building: Building) => {
  try {
    const res = await buildingApi.getBuildingById(building.id)
    console.log(res)
  } catch (error) {
    console.error('Error fetching building:', error)
  }
}
export const getBuildings = async (filters?: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const number = ref(0)
  const buildings = ref<Building[]>([])
  const { page = 1, perPage = 10, search, sortBy, sortingOrder } = filters || {}

  try {
    const response = await buildingApi.getListBuilding(filters)
    console.log(response)
    number.value = response.data.totalItemCount
    buildings.value = response.data.data
    // buildings.value = buildings.value.filter((building) => building.isActive === isActive)
    console.log(buildings.value)
    if (search) {
      buildings.value = buildings.value.filter((building) => building.name.toLowerCase().includes(search.toLowerCase()))
    }

    buildings.value = buildings.value.map((building) => ({ ...building }))

    if (sortBy && sortingOrder) {
      buildings.value = buildings.value.sort((a, b) => {
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
    console.error('Error fetching building list:', error)
  }

  return {
    data: buildings.value,
    pagination: {
      page,
      perPage,
      total: number.value,
    },
  }
}

const hasError = ref(false)

export const addBuilding = async (building: Building) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await buildingApi.createBuilding(building)
    if (!!res && res.status === 1) {
      return { res, hasError }
    }
    await getBuildings() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to create building' }
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
export const updateBuilding = async (building: Building) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await buildingApi.updateBuilding(building)

    if (!!res && res.status === 1) {
      return { res, hasError }
    }

    await getBuildings() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to update building' }
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

export const removeBuilding = async (building: Building) => {
  await sleep(1000)
  const res = await buildingApi.deleteBuilding(building.id)
  console.log(res)
  await getBuildings()
}
