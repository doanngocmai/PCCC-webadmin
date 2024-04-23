import { ApiClient } from '../../../services/apiGlobal/ApiService'

const buildingApi = {
  getListApartmentUser: (payload: any) => ApiClient.get('/api/web/ApartmentUser/GetListBuilding', payload),

  createBuilding: (data) => ApiClient.post('/api/web/ApartmentUser/CreateBuilding', data),

  getBuildingById: (Id: number) => ApiClient.get(`/api/web/ApartmentUser/GetBuildingById?Id=${Id}`),

  updateBuilding: (data) => ApiClient.post('/api/web/ApartmentUser/UpdateBuilding', data),

  deleteBuilding: (Id: number) => ApiClient.delete(`/api/web/ApartmentUser/DeleteBuilding/${Id}`),
}

export default buildingApi
