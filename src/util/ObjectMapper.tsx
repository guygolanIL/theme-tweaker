import React from 'react'

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
