export type Position = {
  col: number,
  row: number,
  span?: number,
}

export type Appearance = {
  template?: string,
  class?: string,
  background?: string,
  borderColor?: string,
  borderSize?: string,
}

export type Connection = {
  dashed?: boolean,
  color?: string,
  size?: number,
  label?: string,
}

export type Handles = {
  size?: number,
  sourceColor?: string,
  destColor?: string,
  arrow?: boolean,
  direction?: "from" | "to"
}
