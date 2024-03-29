import { ApiClient } from '../../../services/apiGlobal/ApiService'

const newApi = {
  getListNew: (payload: any) => ApiClient.get('/api/web/New/GetListNew', payload),

  createNew: (data) => ApiClient.post('/api/web/New/CreateNew', data),

  updateNew: (data) => ApiClient.post('/api/web/New/UpdateNew', data),

  deleteNew: (Id: number) => ApiClient.delete(`/api/web/New/DeleteNew/${Id}`),
}

export default newApi
