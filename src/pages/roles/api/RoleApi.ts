import { ApiClient } from '../../../services/apiGlobal/ApiService'

const roleApi = {
  getListRole: (payload: any) => ApiClient.get('/api/web/Role/GetListRole', payload),

  createRole: (data) => ApiClient.post('/api/web/Role/CreateRole', data),

  updateRole: (data) => ApiClient.post('/api/web/Role/UpdateRole/', data),

  deleteRole: (Id: number) => ApiClient.delete(`/api/web/Role/DeleteRole/${Id}`),
}

export default roleApi
