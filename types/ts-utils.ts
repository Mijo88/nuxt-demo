export {}

declare global {
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

  type Trim<S extends string, Char extends string = ' '> =
    S extends `${infer T}${Char}`
    ? Trim<T, Char>
    : S extends `${Char}${infer T}`
    ? Trim<T, Char>
    : S

  type DeepSearch<Obj extends Record<string, any>, Path extends string, D extends string = '.'> =
    Path extends `${infer Key}${D}${infer Rest}`
    ? Obj[Key] extends Record<string, any>
      ? DeepSearch<Obj[Key], Rest, D>
      : never
    : Obj[Path]
}
