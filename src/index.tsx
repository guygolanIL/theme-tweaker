// eslint-disable-next-line no-unused-vars
import React, { useCallback, useState, useContext, Context } from 'react'

type ThemeContextData = {
  theme: any
  setTheme: React.Dispatch<React.SetStateAction<any>>
}

const ThemeContext: Context<ThemeContextData> = React.createContext({
  theme: {},
  setTheme: (theme) => theme
})

type Provider<T> = (props: {
  theme: T
  children: React.ReactNode
}) => React.ReactElement<any>

export function createThemeTweaker<T>(
  UserProvider?: Provider<T>,
  themeSyncInterval?: number
) {
  return function TweakableThemeProvider({
    theme,
    children
  }: React.PropsWithChildren<{ theme: T }>) {
    const [syncedTheme, setSyncedTheme] = useSyncedTheme<T>(
      theme,
      themeSyncInterval
    )

    let renderChildren = children

    if (UserProvider) {
      renderChildren = (
        <UserProvider theme={syncedTheme}>{children}</UserProvider>
      )
    }

    return (
      <ThemeContext.Provider
        value={{
          theme: theme,
          setTheme: (val) => {
            setSyncedTheme(val)
          }
        }}
      >
        {renderChildren}
      </ThemeContext.Provider>
    )
  }
}

function useSyncedTheme<T>(
  theme: T,
  syncIntervalMilli: number = 500
): [T, (t: T) => void] {
  const [syncedTheme, setSyncedTheme] = useState<T>(theme)
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>()

  const syncTheme = (t: T) => {
    if (timer) {
      clearTimeout(timer)
    }
    const time = setTimeout(() => {
      setSyncedTheme(t)
    }, syncIntervalMilli)

    setTimer(time)
  }

  return [syncedTheme, syncTheme]
}

export function useThemeTweaker<T>(): {
  theme: T
  setTheme: React.Dispatch<React.SetStateAction<T>>
  setThemeProp: (path: string, value: any) => void
} {
  const { theme, setTheme } = useContext(ThemeContext)

  const setThemeProp = useCallback(
    (path: string, value: any) => {
      const pathSplit = path.split('.')
      let cursor = theme

      let i = 0
      for (; i < pathSplit.length - 1; i++) {
        const seg = pathSplit[i]
        cursor = cursor[seg]
      }

      cursor[pathSplit[i]] = value

      setTheme({ ...theme })
    },
    [theme, setTheme]
  )

  return { theme, setTheme, setThemeProp }
}
