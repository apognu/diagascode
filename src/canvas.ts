import { BrowserJsPlumbInstance, newInstance } from "@jsplumb/browser-ui";

export interface Component {
  id: string;
  col: number;
  row: number;

  add(canvas: Canvas): void;
}

export class Canvas {
  instance: BrowserJsPlumbInstance;
  area: HTMLElement;

  private _baseFontSize: number = 12;
  private _backgroundColor: string = "white";
  private _padding: number = 0;
  private _rowGap: number = 48;
  private _columnGap: number = 72;

  private _components: Component[] = [];

  constructor() {
    let area = document.getElementById("dac-area");

    if (!area) {
      area = document.createElement("div");
      area.setAttribute("id", "dac-area");

      area.style.fontSize = `${this._baseFontSize}px`;
      area.style.backgroundColor = this._backgroundColor;
      area.style.padding = `${this._padding}px`;
      area.style.rowGap = `${this._rowGap}px`;
      area.style.columnGap = `${this._columnGap}px`;

      document.body.prepend(area);
    }

    this.area = area;

    this.instance = newInstance({
      container: area,
    });
  }

  add(component: Component) {
    this._components.push(component);

    return component;
  }

  draw() {
    this._components.forEach((component) => {
      component.add(this);
    });

    document.querySelectorAll<HTMLElement>(".dac-node").forEach((n) => {
      const style = getComputedStyle(n);
      const ph = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const pv = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

      let { width, height } = n.getBoundingClientRect();

      width = Math.ceil(width);
      height = Math.ceil(height);

      n.style.width = `${width}px`;
      n.style.height = `${height}px`;

      if (width % 2 !== 0) {
        n.style.width = `${width - ph + 1}px`;
      }
      if (height % 2 !== 0) {
        n.style.height = `${height - pv + 1}px`;
      }
    });
  }

  get baseFontSize() {
    return this._baseFontSize;
  }

  set baseFontSize(size: number) {
    this._baseFontSize = size;
    this.area.style.fontSize = `${size}px`;
  }

  get background() {
    return this._backgroundColor;
  }

  set background(color: string) {
    this._backgroundColor = color;
    this.area.style.backgroundColor = color;
  }

  get padding() {
    return this._padding;
  }

  set padding(padding: number) {
    this._padding = padding;
    this.area.style.padding = `${padding}px`;
  }

  setZonePadding() {
    const padding = Math.max(this.rowGap, this.columnGap) / 4;

    if (padding > this.padding) {
      this.area.style.padding = `calc(${padding}px + 1.3em)`;
    }
  }

  get rowGap() {
    return this._rowGap;
  }

  set rowGap(gap: number) {
    this._rowGap = gap;
    this.area.style.rowGap = `${gap}px`;
  }

  get columnGap() {
    return this._columnGap;
  }

  set columnGap(gap: number) {
    this._columnGap = gap;
    this.area.style.columnGap = `${gap}px`;
  }
}
