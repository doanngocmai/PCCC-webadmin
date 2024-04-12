export type TextTypeBuilding = 'Banner' | 'Footer' | 'Contact' | 'Please Choose Type'
export type TypeBuilding = 1 | 2 | 3 | 0
export type Building = {
  id: number
  name: string
  description: string
  color: string
  link: string
  image: string
  icon: string
  type: number
  isActive: boolean
}
