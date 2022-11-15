export {}

declare global {
  type Split<S extends string, D extends string> =
    S extends `${infer A}${D}${infer B}`
    ? [A, ...Split<B, D>]
    : S extends ''
    ? []
    : [S]
}
