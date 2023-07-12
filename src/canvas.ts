import { BrowserJsPlumbInstance, newInstance } from "@jsplumb/browser-ui";
import { Zone } from "./zone";

export interface Component {
  id: string;
  col: number;
  row: number;
  el: HTMLElement;

  add(canvas: Canvas): void;
}

export type CanvasOptions = {
  id?: string;
  draggable?: boolean;
};

export class Canvas {
  instance: BrowserJsPlumbInstance;
  area: HTMLElement;

  private _drawn: boolean = false;

  private _baseFontSize: number = 12;
  private _backgroundColor: string = "white";
  private _padding: number = 0;
  private _rowGap: number = 48;
  private _columnGap: number = 72;

  private _components: Component[] = [];
  private _zones: Zone[] = [];

  constructor(options: CanvasOptions = {}) {
    options.id = options.id || "dac-area";
    options.draggable = options.draggable || false;

    let area = document.getElementById(options.id);

    if (!area) {
      area = document.createElement("div");
      area.setAttribute("id", options.id);

      document.body.prepend(area);
    }

    area.classList.add("dac-area");
    area.style.fontSize = `${this._baseFontSize}px`;
    area.style.backgroundColor = this._backgroundColor;
    area.style.padding = `${this._padding}px`;
    area.style.rowGap = `${this._rowGap}px`;
    area.style.columnGap = `${this._columnGap}px`;

    this.area = area;

    this.instance = newInstance({
      container: area,
      elementsDraggable: options.draggable,
      dragOptions: {
        start: (params) => {
          if (params.e.target) {
            (params.e.target as HTMLElement).style.position = "absolute";
          }
        },
        stop: (params) => {
          if (params.e) {
            const target = params.e.target as HTMLElement;
            const node = document.getElementById(
              target.getAttribute("id") || "",
            );

            if (node) {
              this._zones.forEach((zone) => {
                if (zone.components.includes(node)) {
                  zone.fit();
                }
              });
            }
          }
        },
      },
    });
  }

  add(component: Component) {
    if (component instanceof Zone) {
      this._zones.push(component);
    }

    this._components.push(component);

    return component;
  }

  draw() {
    if (this._drawn) {
      return;
    }

    this._drawn = true;

    this._components.forEach((component) => {
      component.add(this);
    });

    document.querySelectorAll<HTMLElement>(".dac-node").forEach((n) => {
      const style = getComputedStyle(n);

      const ph =
        parseFloat(style.paddingLeft) +
        parseFloat(style.paddingRight) +
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.borderRightWidth);

      const pv =
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) +
        parseFloat(style.borderTopWidth) +
        parseFloat(style.borderBottomWidth);

      const rect = n.getBoundingClientRect();
      let { width, height } = rect;
      const { x, y } = rect;

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

      const placeholder = document.createElement("div");

      placeholder.style.gridColumn = n.style.gridColumn;
      placeholder.style.gridRow = n.style.gridRow;
      placeholder.style.width = `${width + ph}px`;
      placeholder.style.height = `${height + pv}px`;

      this.area.appendChild(placeholder);

      n.style.top = `${y}px`;
      n.style.left = `${x}px`;
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
