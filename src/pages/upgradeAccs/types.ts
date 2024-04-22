export type TextTypeUpgradeAcc = 'Banner' | 'Footer' | 'Contact' | 'Please Choose Type'
export type TypeUpgradeAcc = 1 | 2 | 3 | 0
export type UpgradeAcc = {
  id: number
  name: string
  type: number
  price: number
  description: string
  startTime: Date
  endTime: Date
  isActive: true
}
