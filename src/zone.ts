import { Canvas, Component } from "./canvas";
import { Position } from "./types";

export type ZoneOptions = {
  title?: string;
  background?: string;
  border?: string;
};

export class Zone implements Component {
  id: string;
  col: number;
  row: number;
  position: Position;
  options: ZoneOptions;

  constructor(position: Position, options: ZoneOptions = {}) {
    this.id = crypto.randomUUID();
    this.col = position.col;
    this.row = position.row;
    this.position = position;
    this.options = options;
  }

  add(canvas: Canvas) {
    canvas.setZonePadding();

    const zone = document.createElement("div");

    zone.classList.add("dac-zone");

    zone.style.gridColumn = `${this.position.col} / span ${this.position.colSpan}`;
    zone.style.gridRow = `${this.position.row} / span ${this.position.rowSpan}`;
    zone.style.width = `calc(100% + (${canvas.columnGap}px / 2))`;
    zone.style.height = `calc(100% + (${canvas.rowGap}px / 2))`;

    if (this.options.background) {
      zone.style.backgroundColor = this.options.background;
    }
    if (this.options.border) {
      zone.style.border = `1px solid ${this.options.border}`;
    }

    if (this.options.title) {
      const title = document.createElement("span");
      const titleText = document.createTextNode(this.options.title);

      title.classList.add("dac-zone-title");
      title.append(titleText);
      zone.append(title);
    }

    document.getElementById("dac-area")!.append(zone);
  }
}
