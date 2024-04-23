export type TextTypeAdvertising = 'Banner' | 'Footer' | 'Contact' | 'Please Choose Type'
export type TypeAdvertising = 1 | 2 | 3 | 0
export type Advertising = {
  id: number
  name: string
  type: number
  price: number
  content: string
  startTime: Date
  endTime: Date
  isActive: true
}
