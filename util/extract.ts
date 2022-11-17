export const getKeys = <
  TypeObject extends Record<string, any>
> (obj: TypeObject): (keyof TypeObject)[] => {
  return Object.keys(obj)
}

export const getValues = <
  TypeObject extends Record<string, any>
> (obj: TypeObject): TypeObject[keyof TypeObject][] => {
  return Object.values(obj)
}

export const getKeysValues = <
  TypeObject extends Record<string, any>
> (obj: TypeObject): [keyof TypeObject, TypeObject[keyof TypeObject]][] => {
  return Object.entries(obj)
}

export const getType = (value: unknown): GetType => {
  return Object.prototype.toString.call(value)
    .slice(8, -1) as GetType
}

const example = {
  foo: 1,
  bar: 'hello',
  baz: {
    a: 1,
    b: 2
  }
} as const

const k = getKeys(example)
const v = getValues(example)
const kv = getKeysValues(example)
const t = getType(new class Example {}())
