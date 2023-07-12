import { Canvas, Component } from "./canvas";
import { Position } from "./types";

export type ZoneOptions = {
  title?: string;
  background?: string;
  border?: string;
  paddingWhenFit?: number;
};

export class Zone implements Component {
  id: string;
  col: number;
  row: number;
  position: Position;
  el: HTMLElement;

  components: HTMLElement[] = [];
  options: ZoneOptions;

  constructor(
    position: Position,
    components: Component[] = [],
    options: ZoneOptions = {},
  ) {
    this.id = crypto.randomUUID();
    this.col = position.col;
    this.row = position.row;
    this.position = position;

    components.forEach((component) => {
      if (component.el) {
        this.components.push(component.el);
      }
    });

    this.el = document.createElement("div");
    this.options = options;
  }

  add(canvas: Canvas) {
    canvas.setZonePadding();

    this.el.setAttribute("id", this.id);
    this.el.classList.add("dac-zone");

    this.el.style.gridColumn = `${this.position.col} / span ${this.position.colSpan}`;
    this.el.style.gridRow = `${this.position.row} / span ${this.position.rowSpan}`;
    this.el.style.width = `calc(100% + (${canvas.options.columnGap}px / 2))`;
    this.el.style.height = `calc(100% + (${canvas.options.rowGap}px / 2))`;

    if (this.options.background) {
      this.el.style.backgroundColor = this.options.background;
    }
    if (this.options.border) {
      this.el.style.border = `1px solid ${this.options.border}`;
    }

    if (this.options.title) {
      const title = document.createElement("span");
      const titleText = document.createTextNode(this.options.title);

      title.classList.add("dac-zone-title");
      title.append(titleText);
      this.el.append(title);
    }

    document.getElementById("dac-area")!.append(this.el);

    this.el.addEventListener("click", () => this.fit());
  }

  fit() {
    if (this.components.length === 0) {
      return;
    }

    let [minX, maxX, minY, maxY] = [-1, -1, -1, -1];

    this.components.forEach((component) => {
      const { x, y, width, height } = component.getBoundingClientRect();

      if (minX === -1 || x < minX) {
        minX = x;
      }
      if (maxX === -1 || x + width > maxX) {
        maxX = x + width;
      }
      if (minY === -1 || y < minY) {
        minY = y;
      }
      if (maxY === -1 || y + height > maxY) {
        maxY = y + height;
      }
    });

    const padding = this.options.paddingWhenFit || 16;

    this.el.style.position = "absolute";
    this.el.style.left = `${minX - padding}px`;
    this.el.style.top = `${minY - padding}px`;
    this.el.style.width = `${maxX - minX + 2 * padding}px`;
    this.el.style.height = `${maxY - minY + 2 * padding}px`;
  }
}
