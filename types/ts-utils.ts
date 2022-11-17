export {}

declare global {
  type Delimiter = ' ' | '-' | '_' | ' ' | '/' | '.'

  type GetType = 'String' |
    'Number' |
    'Null' |
    'Undefined' |
    'Array' |
    'Map' |
    'Object' |
    'Error' |
    'Function'

  type Literal = string | number | bigint | boolean

  type Cast<A extends any, B extends any> =
    A extends B
    ? A
    : B

  type Split<S extends string, D extends string> =
    S extends `${infer A}${D}${infer B}`
    ? [A, ...Split<B, D>]
    : S extends ''
    ? []
    : [S]

  type Replace<S extends string, CharFrom extends string, CharTo extends string> =
    S extends `${infer _X}${CharFrom}${infer _Y}`
    ? Replace<`${_X}${CharTo}${_Y}`, CharFrom, CharTo>
    : S

  type TrimStart<S extends string, Char extends string = Delimiter> =
    S extends `${Char}${infer T}`
    ? TrimStart<T, Char>
    : S

  type TrimEnd<S extends string, Char extends string = Delimiter> =
    S extends `${infer T}${Char}`
    ? TrimEnd<T, Char>
    : S

  type Trim<S extends string, Char extends string = Delimiter> =
    TrimStart<TrimEnd<S, Char>, Char>

  type DeepExtract<Obj extends Record<string, any>, Path extends string, D extends string = '.'> =
    Path extends `${infer Key}${D}${infer Rest}`
    ? Obj[Key] extends Record<string, any>
      ? DeepExtract<Obj[Key], Rest, D>
      : never
    : Obj[Path]
}
