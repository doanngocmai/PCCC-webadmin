import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { User } from '../../pages/accounts/typeAccounts'
import userApi from '../../pages/accounts/api/accountApi'
import { useToast } from 'vuestic-ui'

const { notify } = useToast()

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof User | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: number
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}

export const getAccounts = async (filters?: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const number = ref(0)
  const users = ref<User[]>([])
  const { page = 1, perPage = 10, isActive, search, sortBy, sortingOrder } = filters || {}

  try {
    const response = await userApi.getListUser(filters)
    number.value = response.data.totalItemCount
    users.value = response.data.data
    users.value = users.value.filter((user) => user.isActive === isActive)

    if (search) {
      users.value = users.value.filter((user) => user.userName.toLowerCase().includes(search.toLowerCase()))
      users.value = users.value.filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase()))
    }

    users.value = users.value.map((user) => ({ ...user }))

    if (sortBy && sortingOrder) {
      users.value = users.value.sort((a, b) => {
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
    data: users.value,
    pagination: {
      page,
      perPage,
      total: number.value,
    },
  }
}
const hasError = ref(false)

export const addUser = async (user: User) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await userApi.createUser(user)
    if (!!res && res.status === 1) {
      return { res, hasError }
    }
    await getAccounts() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to create user' }
  } catch (error: any) {
    hasError.value = true

    if (error?.response?.data?.code === 3) {
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
    // Xử lý lỗi không có phản hồi từ backend
    return { error: error.message || 'Unknown error occurred' }
  }
}

export const updateUser = async (user: User) => {
  try {
    await sleep(1000) // Giả lập thời gian chờ
    hasError.value = false
    const res = await userApi.updateUser(user)

    if (!!res && res.status === 1) {
      return { res, hasError }
    }

    await getAccounts() // Gọi lại hàm fetch hoặc hàm tương tự để cập nhật dữ liệu
    return { error: 'Failed to update user' }
  } catch (error: any) {
    hasError.value = true

    if (error?.response?.data?.code === 3) {
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

export const removeUser = async (user: User) => {
  await sleep(1000)
  await userApi.deleteUser(user.id)
  await getAccounts()
}
