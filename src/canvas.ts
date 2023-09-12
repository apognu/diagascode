import { BrowserJsPlumbInstance, newInstance } from "@jsplumb/browser-ui";
import { Zone } from "./zone";
import { YamlCanvas } from "./yaml";

export let DefaultTemplate = "dac-default";

export interface Component {
  id: string;
  col: number;
  row: number;
  el: HTMLElement;

  add(canvas: Canvas): void;
}

export type CanvasOptions = {
  id?: string;

  title?: string;
  subtitle?: string;

  defaultTemplate?: string;

  baseFontSize?: number;
  background?: string;
  padding?: number;
  rowGap?: number;
  columnGap?: number;

  draggable?: boolean;
};

export class Canvas {
  instance: BrowserJsPlumbInstance;
  area: HTMLElement;
  options: CanvasOptions;

  private _drawn: boolean = false;

  private _components: Component[] = [];
  private _zones: Zone[] = [];

  constructor(options: CanvasOptions = {}) {
    options.id ||= "dac-area";
    options.defaultTemplate ||= "dac-default-template";

    DefaultTemplate = options.defaultTemplate;

    options.baseFontSize ||= 12;
    options.background ||= "white";
    options.padding ||= 0;
    options.rowGap ||= 48;
    options.columnGap ||= 72;

    options.draggable ||= false;

    this.options = options;

    let area = document.getElementById(options.id);

    if (!area) {
      area = document.createElement("div");
      area.setAttribute("id", options.id);

      document.body.prepend(area);
    }

    area.classList.add("dac-area");
    area.style.fontSize = `${this.options.baseFontSize}px`;
    area.style.backgroundColor = this.options.background!;
    area.style.padding = `${this.options.padding}px`;
    area.style.rowGap = `${this.options.rowGap}px`;
    area.style.columnGap = `${this.options.columnGap}px`;

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

    let [maxRow, maxCol] = [0, 0];

    document.querySelectorAll<HTMLElement>(".dac-node").forEach((n) => {
      const style = getComputedStyle(n);
      const row = parseFloat(style.gridRow);
      const col = parseFloat(style.gridColumn);

      if (row > maxRow) {
        maxRow = row;
      }
      if (col > maxCol) {
        maxCol = col;
      }

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

    this.setTitles(maxRow, maxCol);

    this.instance.repaintEverything();
  }

  private setTitles(maxRow: number, maxCol: number) {
    const titles = document.createElement("div");
    titles.setAttribute("id", "dac-titles");
    titles.style.gridRow = `${maxRow + 1}`;
    titles.style.gridColumn = `1 / span ${maxCol}`;

    if (this.options.title) {
      const title = document.createElement("p");
      title.setAttribute("id", "dac-title");
      title.textContent = this.options.title;

      titles.appendChild(title);
    }

    if (this.options.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.setAttribute("id", "dac-subtitle");
      subtitle.textContent = this.options.subtitle;

      titles.appendChild(subtitle);
    }

    this.area.appendChild(titles);
  }

  setZonePadding() {
    const padding = Math.max(this.options.rowGap!, this.options.columnGap!) / 4;

    if (padding > this.options.padding!) {
      this.area.style.padding = `calc(${padding}px + 1.3em)`;
    }
  }

  static fromYaml(yaml: unknown) {
    const canvas = Object.assign(new YamlCanvas(), yaml);

    canvas.draw();
  }
}
