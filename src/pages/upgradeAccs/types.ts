export type TextTypeUpgradeAcc = 'Banner' | 'Footer' | 'Contact' | 'Please Choose Type'
export type TypeUpgradeAcc = 1 | 2 | 3 | 0
export type UpgradeAcc = {
  id: number
  title: string
  type: number
  content: string
  image: string
  isActive: true
}
