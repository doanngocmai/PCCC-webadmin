export type TextTypeContent = 'Banner' | 'Footer' | 'Contact' | 'Please Choose Type'
export type TypeContent = 1 | 2 | 3 | 0
export type Content = {
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
