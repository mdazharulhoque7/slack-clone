'use client'

import { Provider } from 'jotai'

interface JotaiProviderProps {
 children: React.ReactNode
}

export const JotaiProviders = ({ children }: JotaiProviderProps) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}