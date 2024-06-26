import { ApiClient } from '../../../services/apiGlobal/ApiService'

const userApi = {
  getListUser: (payload: any) => ApiClient.get('/api/web/User/GetListUser', payload),

  createUser: (userData) => ApiClient.post('/api/web/User/CreateUser', userData),

  updateUser: (userData) => ApiClient.post('/api/web/User/UpdateUser/', userData),

  deleteUser: (userId: number) => ApiClient.delete(`/api/web/User/DeleteUser/${userId}`),
}

export default userApi
