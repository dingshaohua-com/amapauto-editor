export interface MenuItemProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
  variant?: 'default' | 'primary' | 'secondary'
}
