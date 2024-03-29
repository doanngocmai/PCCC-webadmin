import { ApiClient } from '../../../services/apiGlobal/ApiService'

const contentApi = {
  getListContent: (payload: any) => ApiClient.get('/api/web/Content/GetListContent', payload),

  createContent: (data) => ApiClient.post('/api/web/Content/CreateContent', data),

  updateContent: (data) => ApiClient.post('/api/web/Content/UpdateContent', data),

  deleteContent: (Id: number) => ApiClient.delete(`/api/web/Content/DeleteContent/${Id}`),
}

export default contentApi
