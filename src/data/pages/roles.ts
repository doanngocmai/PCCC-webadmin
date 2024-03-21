import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { Role } from '../../pages/roles/types'
import roleApi from '../../pages/roles/api/RoleApi'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Role | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  return obj[sortBy]
}

export const getRoles = async (filters?: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const number = ref(0)
  const roles = ref<Role[]>([])
  const { page = 1, perPage = 10, isActive, search, sortBy, sortingOrder } = filters || {}

  try {
    console.log(filters)
    const response = await roleApi.getListRole(filters)
    number.value = response.data.totalItemCount
    roles.value = response.data.data
    roles.value = roles.value.filter((role) => role.isActive === isActive)

    if (search) {
      roles.value = roles.value.filter((role) => role.roleName.toLowerCase().includes(search.toLowerCase()))
    }

    roles.value = roles.value.map((role) => ({ ...role }))

    if (sortBy && sortingOrder) {
      roles.value = roles.value.sort((a, b) => {
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
    console.log(roles.value)
  } catch (error) {
    console.error('Error fetching content list:', error)
  }

  return {
    data: roles.value,
    pagination: {
      page,
      perPage,
      total: number.value,
    },
  }
}

export const addRole = async (role: Role) => {
  await sleep(1000)
  const res = await roleApi.createRole(role)
  console.log(res)
  await getRoles()
}

export const updateRole = async (role: Role) => {
  await sleep(1000)
  await roleApi.updateRole(role)
  await getRoles()
}

export const removeRole = async (role: Role) => {
  await sleep(1000)
  await roleApi.deleteRole(role.id)
  await getRoles()
}
