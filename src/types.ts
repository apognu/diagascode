export type Position = {
  col: number;
  colSpan?: number;
  row: number;
  rowSpan?: number;
};

export type Appearance = {
  template?: string;
  class?: string;
  background?: string;
  borderColor?: string;
  borderSize?: number;
};

export type Connection = {
  dashed?: boolean;
  color?: string;
  size?: number;
  label?: string;
};

export type Handles = {
  size?: number;
  sourceColor?: string;
  destColor?: string;
  arrow?: boolean;
  direction?: "from" | "to";
};
