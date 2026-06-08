import type { ReactNode } from 'react'

export interface BeautifulThemeProviderProps {
  children: ReactNode
}

export function BeautifulThemeProvider(props: BeautifulThemeProviderProps) {
  return <>{props.children}</>
}
