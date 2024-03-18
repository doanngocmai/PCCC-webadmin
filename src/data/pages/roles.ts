import { ref } from 'vue'
import { sleep } from '../../services/utils'
import { Role } from '../../pages/roles/types'
import roleApi from '../../pages/roles/api/RoleApi'

// export const roles = role as Role[]

const roles = ref<Role[]>([])

const fetchRoleList = async () => {
  try {
    const response = await roleApi.getListRole(null)
    roles.value = response.data.data
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
  sortBy: keyof Role | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  // if (sortBy === 'projects') {
  //   return obj.projects.map((project: any) => project.project_name).join(', ')
  // }
  return obj[sortBy]
}

export const getRoles = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  await fetchRoleList()
  const { isActive, search, sortBy, sortingOrder } = filters
  const filteredRoles = roles
  console.log(roles)

  filteredRoles.value = filteredRoles.value.filter((role) => role.isActive === isActive)

  if (search) {
    filteredRoles.value = filteredRoles.value.filter((role) =>
      role.roleName.toLowerCase().includes(search.toLowerCase()),
    )
  }

  filteredRoles.value = filteredRoles.value.map((role) => ({ ...role }))

  if (sortBy && sortingOrder) {
    filteredRoles.value = filteredRoles.value.sort((a, b) => {
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
    data: filteredRoles.value.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredRoles.value.length,
    },
  }
}

export const addRole = async (role: Role) => {
  await sleep(1000)
  await roleApi.createRole(role)
  await fetchRoleList()
}

export const updateRole = async (role: Role) => {
  await sleep(1000)
  await roleApi.updateRole(role)
  await fetchRoleList()
}

export const removeRole = async (role: Role) => {
  await sleep(1000)
  await roleApi.deleteRole(role.id)
  await fetchRoleList()
}
