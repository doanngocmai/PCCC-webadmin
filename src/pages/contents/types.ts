export type TextTypeContent = 'Banner' | 'Footer' | 'Contact'
export type TypeContent = '1' | '2' | '3'
export type Content = {
  id: number
  name: string
  description: string
  color: string
  link: string
  icon: string
  type: number
  isActive: boolean
}
