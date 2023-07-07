import { BrowserJsPlumbInstance, newInstance } from "@jsplumb/browser-ui";

export class Canvas {
  static instance: BrowserJsPlumbInstance;
  static area: HTMLElement;

  private static _baseFontSize: number = 12;
  private static _backgroundColor: string = "white";
  private static _padding: number = 0;
  private static _rowGap: number = 48;
  private static _columnGap: number = 72;

  static setup() {
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

      this.area = area;

      this.instance = newInstance({
        container: area,
      });
    }
  }

  static finalize() {
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

  static get baseFontSize() {
    return this._baseFontSize;
  }

  static set baseFontSize(size: number) {
    this._baseFontSize = size;
    this.area.style.fontSize = `${size}px`;
  }

  static get background() {
    return this._backgroundColor;
  }

  static set background(color: string) {
    this._backgroundColor = color;
    this.area.style.backgroundColor = color;
  }

  static get padding() {
    return this._padding;
  }

  static set padding(padding: number) {
    this._padding = padding;
    this.area.style.padding = `${padding}px`;
  }

  static setZonePadding() {
    const padding = Math.max(this.rowGap, this.columnGap) / 4;

    this.area.style.padding = `calc(${padding}px + 1.3em)`;
  }

  static get rowGap() {
    return this._rowGap;
  }

  static set rowGap(gap: number) {
    this._rowGap = gap;
    this.area.style.rowGap = `${gap}px`;
  }

  static get columnGap() {
    return this._columnGap;
  }

  static set columnGap(gap: number) {
    this._columnGap = gap;
    this.area.style.columnGap = `${gap}px`;
  }
}
