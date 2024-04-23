import { ApiClient } from '../../../services/apiGlobal/ApiService'

const newUpgradeAcc = {
  getListAdvertisings: (payload: any) => ApiClient.get('/api/web/Advertising/GetListAds', payload),

  createAdvertising: (data) => ApiClient.post('/api/web/Advertising/CreateAds', data),

  updateAdvertising: (data) => ApiClient.post('/api/web/Advertising/UpdateAds', data),

  deleteAdvertising: (Id: number) => ApiClient.delete(`/api/web/Advertising/DeleteAds/${Id}`),
}

export default newUpgradeAcc
