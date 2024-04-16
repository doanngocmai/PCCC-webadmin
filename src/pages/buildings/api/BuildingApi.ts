import { ApiClient } from '../../../services/apiGlobal/ApiService'

const buildingApi = {
  getListBuilding: (payload: any) => ApiClient.get('/api/web/Building/GetListBuilding', payload),

  createBuilding: (data) => ApiClient.post('/api/web/Building/CreateBuilding', data),

  getBuildingById: (Id: number) => ApiClient.get(`/api/web/Building/GetBuildingById?Id=${Id}`),

  updateBuilding: (data) => ApiClient.post('/api/web/Building/UpdateBuilding', data),

  deleteBuilding: (Id: number) => ApiClient.delete(`/api/web/Building/DeleteBuilding/${Id}`),
}

export default buildingApi
