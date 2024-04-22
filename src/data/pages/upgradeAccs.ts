import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { UpgradeAcc } from '../../pages/upgradeAccs/types'
import upgradeAccApi from '../../pages/upgradeAccs/api/UpgradeAccApi'
import { useToast } from 'vuestic-ui'

const { notify } = useToast()
export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof UpgradeAcc | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}

export const getUpgradeAccs = async (filters?: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const number = ref(0)
  const upgrades = ref<UpgradeAcc[]>([])
  const { page = 1, perPage = 10, isActive, search, sortBy, sortingOrder } = filters || {}

  try {
    const response = await upgradeAccApi.getListUpgradeAccount(filters)
    console.log(response)
    number.value = response.data.totalItemCount
    upgrades.value = response.data.data
    upgrades.value = upgrades.value.filter((upgrade) => upgrade.isActive === isActive)

    if (search) {
      upgrades.value = upgrades.value.filter((upgrade) => upgrade.name.toLowerCase().includes(search.toLowerCase()))
    }

    upgrades.value = upgrades.value.map((upgrade) => ({ ...upgrade }))

    if (sortBy && sortingOrder) {
      upgrades.value = upgrades.value.sort((a, b) => {
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
    console.error('Error fetching upgrade list:', error)
  }

  return {
    data: upgrades.value,
    pagination: {
      page,
      perPage,
      total: number.value,
    },
  }
}

const hasError = ref(false)

export const addUpgradeAccs = async (upgrade: UpgradeAcc) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await upgradeAccApi.createUpgradeAcc(upgrade)
    if (!!res && res.status === 1) {
      return { res, hasError }
    }
    await getUpgradeAccs() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to create upgrade' }
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
export const updateUpgradeAcc = async (upgrade: UpgradeAcc) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await upgradeAccApi.updateUpgradeAcc(upgrade)

    if (!!res && res.status === 1) {
      return { res, hasError }
    }

    await getUpgradeAccs() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to update upgrade' }
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

export const removeUpgradeAcc = async (upgrade: UpgradeAcc) => {
  await sleep(1000)
  const res = await upgradeAccApi.deleteUpgradeAcc(upgrade.id)
  console.log(res)
  await getUpgradeAccs()
}
