export interface MenuItemProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'warning'
    | 'info'
    | 'success'
    | 'purple'
    | 'pink'
    | 'indigo'
    | 'teal'
    | 'amber'
    | 'lime'
    | 'violet'
    | 'rose'
    | 'sky'
    | 'emerald'
    | 'slate'
    | 'neutral'
    | 'dark'
    | 'light'
}
