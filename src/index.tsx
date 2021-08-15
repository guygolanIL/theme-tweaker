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

const supportedLeafType = ['number', 'string']

type PrimitiveMapping = (
  propName: string,
  value: number | string,
  propPath: string
) => React.ReactElement<any> | undefined

type ThemeMapping<T, P> = { [key in keyof T]: P }

type PartialThemeMapping<T, P> = Partial<ThemeMapping<T, P>>

type ObjectMapperProps<T extends Object> = {
  object: T
  primitiveMapping: PrimitiveMapping
  mapping: (
    themeMapping: PartialThemeMapping<T, React.ReactElement<any>>,
    nestingLevel: number
  ) => React.ReactElement<any>
  exclude?: PartialThemeMapping<T, any>
  nestingLevel?: number
  path?: (keyof T)[]
}

export function ObjectMapper<T>({
  object,
  primitiveMapping,
  mapping,
  exclude,
  nestingLevel = 0,
  path = []
}: ObjectMapperProps<T>) {
  const result: PartialThemeMapping<T, React.ReactElement<any>> = {}
  Object.entries(object).forEach(([key, value]) => {
    const keyOfT = key as keyof T
    const excluded = exclude && exclude[keyOfT]
    if (!excluded) {
      const p = [...path, keyOfT]
      if (value.constructor.name === 'Object') {
        result[keyOfT] = (
          <ObjectMapper
            object={value}
            primitiveMapping={primitiveMapping}
            mapping={mapping}
            exclude={exclude && exclude[keyOfT]}
            nestingLevel={nestingLevel + 1}
            path={p}
          />
        )
      }

      if (supportedLeafType.includes(typeof value)) {
        const mapped = primitiveMapping(key, value, p.join('.'))
        if (mapped) {
          result[keyOfT] = mapped
        }
      }
    }
  })

  return mapping(result, nestingLevel)
}
