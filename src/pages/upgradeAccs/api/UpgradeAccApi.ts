import { ApiClient } from '../../../services/apiGlobal/ApiService'

const newUpgradeAcc = {
  getListUpgradeAccount: (payload: any) => ApiClient.get('/api/web/UpgradeAccount/GetListUpgradeAccount', payload),

  createUpgradeAcc: (data) => ApiClient.post('/api/web/UpgradeAccount/CreateUpgradeAcc', data),

  updateUpgradeAcc: (data) => ApiClient.post('/api/web/UpgradeAccount/UpdateUpgradeAcc', data),

  deleteUpgradeAcc: (Id: number) => ApiClient.delete(`/api/web/UpgradeAccount/DeleteUpgradeAcc/${Id}`),
}

export default newUpgradeAcc
