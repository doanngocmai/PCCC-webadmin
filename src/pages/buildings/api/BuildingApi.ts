import { ApiClient } from '../../../services/apiGlobal/ApiService'

const buildingApi = {
  getListBuilding: (payload: any) => ApiClient.get('/api/web/Building/GetListBuilding', payload),

  createBuilding: (data) => ApiClient.post('/api/web/Building/CreateBuilding', data),

  getBuildingById: (id: number) => ApiClient.get('/api/web/Building/GetBuildingById', id),

  updateBuilding: (data) => ApiClient.post('/api/web/Building/UpdateBuilding', data),

  deleteBuilding: (Id: number) => ApiClient.delete(`/api/web/Building/DeleteBuilding/${Id}`),
}

export default buildingApi
