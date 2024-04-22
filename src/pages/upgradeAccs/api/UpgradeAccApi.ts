import { ApiClient } from '../../../services/apiGlobal/ApiService'

const newUpgradeAcc = {
  getListUpgradeAccount: (payload: any) => ApiClient.get('/api/web/UpgradeAcc/GetListUpgradeAccount', payload),

  createUpgradeAcc: (data) => ApiClient.post('/api/web/UpgradeAcc/CreateUpgradeAcc', data),

  updateUpgradeAcc: (data) => ApiClient.post('/api/web/UpgradeAcc/UpdateUpgradeAcc', data),

  deleteUpgradeAcc: (Id: number) => ApiClient.delete(`/api/web/UpgradeAcc/DeleteUpgradeAcc/${Id}`),
}

export default newUpgradeAcc
