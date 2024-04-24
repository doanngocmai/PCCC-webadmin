import { ApiClient } from '../../../services/apiGlobal/ApiService'

const buildingApi = {
  getListApartmentUser: (payload: any) => ApiClient.get('/api/web/ApartmentUser/GetListApartmentUser', payload),

  createApartmentUser: (data) => ApiClient.post('/api/web/ApartmentUser/CreateApartmentUser', data),

  getApartmentUserById: (Id: number) => ApiClient.get(`/api/web/ApartmentUser/GetApartmentUserById?Id=${Id}`),

  updateApartmentUser: (data) => ApiClient.post('/api/web/ApartmentUser/UpdateApartmentUser', data),

  deleteApartmentUser: (Id: number) => ApiClient.delete(`/api/web/ApartmentUser/DeleteApartmentUser/${Id}`),
}

export default buildingApi
